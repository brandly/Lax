class SelectList<A> {
  static fromElement(element: A): SelectList<A> {
    return new SelectList([], element, [])
  }

  before: Array<A>
  selected: A
  after: Array<A>

  constructor(before: Array<A>, selected: A, after: Array<A>) {
    this.before = before
    this.selected = selected
    this.after = after
  }

  getSelected(): A {
    return this.selected
  }

  applyToSelected(fn: (arg0: A) => A): SelectList<A> {
    this.selected = fn(this.selected)
    return this
  }

  selectWhere(fn: (arg0: A) => boolean): SelectList<A> {
    const beforeIndex = this.before.findIndex(fn)

    if (beforeIndex >= 0) {
      const before = this.before.slice(0, beforeIndex)
      const selected = this.before[beforeIndex]
      const after = this.before
        .slice(beforeIndex + 1)
        .concat(this.selected, this.after)
      return new SelectList(before, selected, after)
    }

    if (fn(this.selected)) {
      return this
    }

    const afterIndex = this.after.findIndex(fn)

    if (afterIndex >= 0) {
      const before = this.before.concat(
        this.selected,
        this.after.slice(0, afterIndex)
      )
      const selected = this.after[afterIndex]
      const after = this.after.slice(afterIndex + 1)
      return new SelectList(before, selected, after)
    }

    return this
  }

  map<B>(fn: (arg0: A, arg1: boolean) => B): SelectList<B> {
    return new SelectList(
      this.before.map((a) => fn(a, false)),
      fn(this.selected, true),
      this.after.map((a) => fn(a, false))
    )
  }

  concat(vals: Array<A>): SelectList<A> {
    return new SelectList(this.before, this.selected, this.after.concat(vals))
  }

  filter(fn: (arg0: A) => boolean): SelectList<A> | null | undefined {
    const before = this.before.filter(fn)
    const after = this.after.filter(fn)

    if (fn(this.selected)) {
      return new SelectList(before, this.selected, after)
    }

    const list = [].concat(before, after)

    if (list.length) {
      return new SelectList([], list[0], list.slice(1))
    }

    return null
  }

  find(fn: (arg0: A) => boolean): A | null | undefined {
    return (
      this.before.find(fn) ||
      (fn(this.selected) ? this.selected : undefined) ||
      this.after.find(fn)
    )
  }

  toArray(): Array<A> {
    return [].concat(this.before, this.selected, this.after)
  }

  get length(): number {
    return this.before.length + 1 + this.after.length
  }

  nextWrap(): SelectList<A> {
    // step forward one index
    if (this.after.length) {
      return new SelectList(
        this.before.concat(this.selected),
        this.after[0],
        this.after.slice(1)
      ) // wrap to index 0
    } else if (this.before.length) {
      return new SelectList(
        [],
        this.before[0], // everything but the first
        this.before
          .slice(1) // ...joined with everything else
          .concat(this.selected, this.after)
      ) // nowhere to go
    } else {
      return this
    }
  }

  prevWrap(): SelectList<A> {
    // step backward one index
    if (this.before.length) {
      return new SelectList(
        this.before.slice(0, this.before.length - 1),
        this.before[this.before.length - 1],
        [this.selected].concat(this.after)
      ) // wrap to last index
    } else if (this.after.length) {
      return new SelectList(
        this.before.concat(
          this.selected,
          this.after.slice(0, this.after.length - 1)
        ),
        this.after[this.after.length - 1],
        []
      ) // nowhere to go
    } else {
      return this
    }
  }
}

export default SelectList

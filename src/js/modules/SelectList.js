// @flow
class SelectList<A> {
  static fromElement (element: A): SelectList<A> {
    return new SelectList([], element, [])
  }

  before: Array<A>;
  selected: A;
  after: Array<A>;
  constructor (before: Array<A>, selected: A, after: Array<A>) {
    this.before = before
    this.selected = selected
    this.after = after
  }

  getSelected (): A {
    return this.selected
  }

  applyToSelected (fn: (A) => A): SelectList<A> {
    this.selected = fn(this.selected)
    return this
  }

  selectWhere (fn: (A) => boolean): SelectList<A> {
    const beforeIndex = this.before.findIndex(fn)
    if (beforeIndex >= 0) {
      const before = this.before.slice(0, beforeIndex)
      const selected = this.before[beforeIndex]
      const after = this.before.slice(beforeIndex + 1).concat(this.selected, this.after)
      return new SelectList(before, selected, after)
    }

    if (fn(this.selected)) {
      return this
    }

    const afterIndex = this.after.findIndex(fn)
    if (afterIndex >= 0) {
      const before = this.before.concat(this.selected, this.after.slice(0, afterIndex))
      const selected = this.after[afterIndex]
      const after = this.after.slice(afterIndex + 1)
      return new SelectList(before, selected, after)
    }

    return this
  }

  map (fn: (A) => A): SelectList<A> {
    return new SelectList(this.before.map(fn), fn(this.selected), this.after.map(fn))
  }

  concat (vals: Array<A>): SelectList<A> {
    return new SelectList(this.before, this.selected, this.after.concat(vals))
  }

  filter (fn: (A) => boolean): ?SelectList<A> {
    const before = this.before.filter(fn)
    const after = this.after.filter(fn)

    const list = fn(this.selected) ? [].concat(before, this.selected, after) : [].concat(before, after)

    if (list.length) {
      if (fn(this.selected)) {
        return new SelectList(before, this.selected, after)
      } else if (after.length) {
        return new SelectList(before, after[0], after.slice(1))
      } else {
        return new SelectList(before.slice(1), before[0], after)
      }
    }
  }

  find (fn: (A) => boolean): ?A {
    return this.before.find(fn) || (fn(this.selected) ? this.selected : undefined) || this.after.find(fn)
  }

  toArray (): Array<A> {
    return [].concat(this.before, this.selected, this.after)
  }

  length (): number {
    return this.before.length + 1 + this.after.length
  }
}

export default SelectList

const { localStorage } = window

export default class Persistor<A> {
  key: string
  default: A

  constructor(key: string, def: A) {
    this.key = key
    this.default = def
  }

  init(): A {
    if (this.key in localStorage) {
      try {
        return JSON.parse(localStorage[this.key])
      } catch (e) {
        if (e instanceof SyntaxError) {
          localStorage.removeItem(this.key)
          return this.default
        } else {
          throw e
        }
      }
    } else {
      return this.default
    }
  }

  wrap(reducer: (state: A, action: Action) => A) {
    return (state: A, action: Action) => {
      const after = reducer(state || this.init(), action)
      if (typeof after !== 'undefined' && state !== after) {
        localStorage.setItem(this.key, JSON.stringify(after))
      }
      return after
    }
  }
}

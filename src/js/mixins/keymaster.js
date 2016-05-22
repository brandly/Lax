import keymaster from 'keymaster'

module.exports = {
  // Maps shortcut strings to functions
  keyMap: {},

  setKeymaster (keyMap) {
    const keys = Object.keys(keyMap)
    for (let key of keys) {
      let handler = keyMap[key]
      this.keyMap[key] = handler
      keymaster(key, handler)
    }
  },

  componentWillUnmount () {
    const keys = Object.keys(this.keyMap)
    for (let key of keys) {
      keymaster.unbind(key, this.keyMap[key])
    }
  }
}

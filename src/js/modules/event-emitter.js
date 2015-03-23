import { EventEmitter } from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

const EE = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

module.exports = EE;

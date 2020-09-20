// Couldn't convince flow that `visiblitychange` is allowed
// global document
import type { Dispatchable } from '../flow'

export const listenToDocumentEvent = (
  name: string,
  mapEventToAction: (EventTarget) => Dispatchable,
  filter: (EventTarget) => boolean = (e) => true
): Dispatchable => {
  return (dispatch) => {
    const handleEvent: FocusEventHandler = (e) => {
      if (filter(e)) {
        dispatch(mapEventToAction(e))
      }
    }

    document.addEventListener(name, handleEvent)
    return () => document.removeEventListener(name, handleEvent)
  }
}

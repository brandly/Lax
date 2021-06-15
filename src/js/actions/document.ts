// Couldn't convince flow that `visiblitychange` is allowed
// global document
import type { Dispatchable } from "../flow";
export const listenToDocumentEvent = (name: string, mapEventToAction: (arg0: EventTarget) => Dispatchable, filter: (arg0: EventTarget) => boolean = e => true): Dispatchable => {
  return dispatch => {
    const handleEvent: FocusEventHandler = e => {
      if (filter(e)) {
        dispatch(mapEventToAction(e));
      }
    };

    document.addEventListener(name, handleEvent);
    return () => document.removeEventListener(name, handleEvent);
  };
};
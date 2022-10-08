// Couldn't convince flow that `visiblitychange` is allowed
// global document
import type { Dispatchable, AppDispatch } from '../store'
export const listenToDocumentEvent = (
  name: string,
  mapEventToAction: (arg0: Event) => Dispatchable,
  filter: (arg0: Event) => boolean = (e) => true
): Dispatchable => {
  return (dispatch: AppDispatch) => {
    const handleEvent = (e: Event): void => {
      if (filter(e)) {
        dispatch(mapEventToAction(e))
      }
    }

    document.addEventListener(name, handleEvent)
    return () => document.removeEventListener(name, handleEvent)
  }
}

// Produces a function to be passed to Array#sort
export default function sortBy<T, Comparable>(fn: (arg: T) => Comparable) {
  return (a: T, b: T) => (fn(a) < fn(b) ? -1 : fn(a) > fn(b) ? 1 : 0)
}

// Produces a function to be passed to Array#sort
export default function sortBy(fn) {
  return (a, b) => fn(a) < fn(b) ? -1 : fn(a) > fn(b) ? 1 : 0;
}
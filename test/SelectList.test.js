// @flow
import SelectList from '../src/js/modules/SelectList'
declare var test: any
declare var expect: any

test('has length', () => {
  const val = 'sup'
  const list = SelectList.fromElement(val)
  expect(list.length()).toBe(1)
})

test('can concat', () => {
  const list = SelectList.fromElement('a').concat(['b', 'c'])
  expect(list.length()).toBe(3)
})

test('returns self if no change in selection', () => {
  const list = SelectList.fromElement('a').concat(['b', 'c'])
  expect(list.getSelected()).toBe('a')
  const otherList = list.selectWhere(v => v === 'a')
  expect(list).toBe(otherList)
})

test('can change selection', () => {
  let list = SelectList.fromElement('a').concat(['b', 'c'])
  expect(list.getSelected()).toBe('a')

  list = list.selectWhere(v => v === 'b')
  expect(list.getSelected()).toBe('b')
})

test('can filter', () => {
  let list = SelectList.fromElement('a').concat(['b', 'c'])
  expect(list.getSelected()).toBe('a')

  list = list.filter(v => v >= 'b')
  expect(list && list.length()).toEqual(2)
  expect(list && list.getSelected()).toBe('b')
})

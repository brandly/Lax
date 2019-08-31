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

test('can map', () => {
  let list = SelectList.fromElement('a').concat(['b', 'c'])
  list = list.map(v => v + 'z')
  expect(list.length()).toEqual(3)
  expect(list.getSelected()).toEqual('az')
})

test('can filter', () => {
  let list = SelectList.fromElement('a').concat(['b', 'c'])
  expect(list.getSelected()).toBe('a')

  list = list.filter(v => v >= 'b')
  expect(list && list.length()).toEqual(2)
  expect(list && list.getSelected()).toBe('b')
})

test('can find', () => {
  const list = SelectList.fromElement('a').concat(['b', 'c'])
  expect(list.getSelected()).toBe('a')

  const val = list.find(v => v === 'b')
  expect(val).toBe('b')
})

test('can nextWrap', () => {
  let list = SelectList.fromElement('a').concat(['b', 'c'])
  expect(list.getSelected()).toBe('a')

  list = list.nextWrap()
  expect(list.getSelected()).toBe('b')

  list = list.nextWrap()
  expect(list.getSelected()).toBe('c')

  list = list.nextWrap()
  expect(list.getSelected()).toBe('a')
})

test('can prevWrap', () => {
  let list = SelectList.fromElement('a').concat(['b', 'c'])
  expect(list.getSelected()).toBe('a')

  list = list.prevWrap()
  expect(list.getSelected()).toBe('c')

  list = list.prevWrap()
  expect(list.getSelected()).toBe('b')

  list = list.prevWrap()
  expect(list.getSelected()).toBe('a')
})

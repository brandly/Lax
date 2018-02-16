// @flow
import conversationsReducer from '../src/js/reducers/conversations'
import type { Action } from '../src/js/flow'
declare var test : any;
declare var expect : any;

const apply = (actions: Array<Action>, initial = {}) =>
  actions.reduce(conversationsReducer, initial)

test('connection success creates conversation', () => {
  const id = 'fake'
  const { list } = apply([{
    type: 'REQUEST_CONNECTION_SUCCESS',
    connectionId: id
  }])

  expect(list.length).toBe(1)
  expect(list[0].type).toBe('CONNECTION')
  expect(list[0].name).toBe(id)
})

test('RECEIVE_JOIN adds someone to conversation.people and messages the channel', () => {
  const id = 'abc123'
  const { list } = apply([{
    type: 'REQUEST_CONNECTION_SUCCESS',
    connectionId: id
  }, {
    type: 'RECEIVE_JOIN',
    channel: id,
    from: 'matt'
  }])

  expect(list[0].messages.length).toBe(1)
  expect(list[0].messages[0].type).toBe('join')
  expect(list[0].people.length).toBe(1)
})

test('RECEIVE_QUIT removes someone from relevant convos and messages the channels', () => {
  const id = 'abc123'
  const channel = '#jest'
  const nick = 'matt'

  const { list } = apply([{
    type: 'REQUEST_CONNECTION_SUCCESS',
    connectionId: id
  }, {
    type: 'COMMAND_JOIN',
    name: channel
  }, {
    type: 'RECEIVE_JOIN',
    channel,
    from: nick
  }, {
    type: 'RECEIVE_QUIT',
    nick,
    message: 'im gone'
  }])

  expect(list.length).toBe(2)
  const convo = list[1]
  expect(convo.messages.length).toBe(2)
  expect(convo.messages[1].type).toBe('quit')
  expect(convo.people.length).toBe(0)
})

test('RECEIVE_JOIN for ##programming removes #programming convo', () => {
  const id = 'abc123'

  const { list } = apply([{
    type: 'REQUEST_CONNECTION_SUCCESS',
    connectionId: id
  }, {
    type: 'COMMAND_JOIN',
    name: '#programming'
  }, {
    type: 'RECEIVE_JOIN',
    channel: '##programming',
    from: 'nick'
  }])

  expect(list.length).toBe(2)
})

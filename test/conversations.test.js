/* global test, expect */
import conversationsReducer from '../src/js/reducers/conversations'
import {
  // RECEIVE_CHANNEL_MESSAGE,
  REQUEST_CONNECTION,
  // RECEIVE_DIRECT_MESSAGE,
  RECEIVE_JOIN,
  // RECEIVE_MOTD,
  // RECEIVE_NAMES,
  // RECEIVE_NOTICE,
  // RECEIVE_PART,
  RECEIVE_QUIT,
  // RECEIVE_TOPIC,
  // RECEIVE_WELCOME,
  COMMAND
} from '../src/js/actions'

const apply = (actions, initial = {}) =>
  actions.reduce(conversationsReducer, initial)

test('connection success creates conversation', () => {
  const id = 'fake'
  const { list } = apply([{
    type: REQUEST_CONNECTION.SUCCESS,
    payload: {
      id
    }
  }])

  expect(list.length).toBe(1)
  expect(list[0].type).toBe('CONNECTION')
  expect(list[0].name).toBe(id)
})

test('RECEIVE_JOIN adds someone to conversation.people and messages the channel', () => {
  const id = 'abc123'
  const { list } = apply([{
    type: REQUEST_CONNECTION.SUCCESS,
    payload: {
      id
    }
  }, {
    type: RECEIVE_JOIN,
    payload: {
      channel: id,
      from: 'matt'
    }
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
    type: REQUEST_CONNECTION.SUCCESS,
    payload: {
      id
    }
  }, {
    type: COMMAND.join,
    payload: {
      name: channel
    }
  }, {
    type: RECEIVE_JOIN,
    payload: {
      channel,
      from: nick
    }
  }, {
    type: RECEIVE_QUIT,
    payload: {
      nick,
      message: 'im gone'
    }
  }])

  expect(list.length).toBe(2)
  const convo = list[1]
  expect(convo.messages.length).toBe(2)
  expect(convo.messages[1].type).toBe('quit')
  expect(convo.people.length).toBe(0)
})

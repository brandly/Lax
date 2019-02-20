// @flow
import conversationsReducer from '../src/js/reducers/conversations'
import type { Action, ConnectionT } from '../src/js/flow'
declare var test: any
declare var expect: any

const apply = (actions: Array<Action>, initial = null) => {
  const result = actions.reduce(conversationsReducer, initial)
  return result ? result.toArray() : []
}

test('connection success creates conversation', () => {
  const id = 'fake'
  const list = apply([
    {
      type: 'REQUEST_CONNECTION_SUCCESS',
      connection: stubConnection(id)
    }
  ])

  expect(list.length).toBe(1)
  expect(list[0].type).toBe('CONNECTION')
  expect(list[0].name).toBe(id)
})

const connectionId = 'abc123'
const withConnection = (actions: Array<Action>): Array<Action> => {
  return [
    {
      type: 'REQUEST_CONNECTION_SUCCESS',
      connection: stubConnection(connectionId)
    }
  ].concat(actions)
}

test('RECEIVE_JOIN adds someone to conversation.people and messages the channel', () => {
  const id = 'abc123'
  const list = apply(
    withConnection([
      {
        type: 'RECEIVE_JOIN',
        connectionId,
        channel: id,
        from: 'matt'
      }
    ])
  )

  expect(list[0].messages.length).toBe(1)
  expect(list[0].messages[0].type).toBe('join')
  expect(list[0].people.length).toBe(1)
})

test('RECEIVE_QUIT removes someone from relevant convos and messages the channels', () => {
  const channel = '#jest'
  const nick = 'matt'

  const list = apply(
    withConnection([
      {
        type: 'COMMAND_JOIN',
        connectionId,
        name: channel
      },
      {
        type: 'RECEIVE_JOIN',
        connectionId,
        channel,
        from: nick
      },
      {
        type: 'RECEIVE_QUIT',
        connectionId,
        nick,
        message: 'im gone'
      }
    ])
  )

  expect(list.length).toBe(2)
  const convo = list[1]
  expect(convo.messages.length).toBe(2)
  expect(convo.messages[1].type).toBe('quit')
  expect(convo.people.length).toBe(0)
})

test('RECEIVE_JOIN for ##programming removes #programming convo', () => {
  const list = apply(
    withConnection([
      {
        type: 'COMMAND_JOIN',
        connectionId,
        name: '#programming'
      },
      {
        type: 'RECEIVE_JOIN',
        connectionId,
        channel: '##programming',
        from: 'nick'
      }
    ])
  )

  expect(list.length).toBe(2)
  expect(list[1].type).toBe('CHANNEL')
})

test('RECEIVE_DIRECT_MESSAGE doesnt care about case', () => {
  const list = apply(
    withConnection([
      {
        type: 'RECEIVE_DIRECT_MESSAGE',
        connectionId,
        from: 'someone',
        message: 'hi'
      },
      {
        type: 'RECEIVE_DIRECT_MESSAGE',
        connectionId,
        from: 'SOMEONE',
        message: 'hello'
      }
    ])
  )

  expect(list.length).toBe(2)
})

function stubConnection(id: string): ConnectionT {
  return {
    id,
    isConnected: true,
    isWelcome: true,
    credentials: {
      nickname: 'string',
      realName: 'string',
      server: 'string',
      port: 6667,
      password: 'hunter42'
    },
    client: {
      join: s => {},
      nick: s => {},
      send: (to: string, msg: string) => {},
      notice: (a: string, b: string) => {},
      action: (target: string, msg: string) => {},
      part: (channel: Array<string>) => {},
      removeAllListeners: () => {},
      stream: {
        destroy: () => {}
      }
    },
    error: null,
    conversations: null
  }
}

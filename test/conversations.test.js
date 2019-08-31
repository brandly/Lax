// @flow
import conversationsReducer from '../src/js/reducers/conversations'
import type {
  ConversationT,
  ConversationType,
  MessageT,
  Action
} from '../src/js/flow'
import SelectList from '../src/js/modules/SelectList'
declare var test: any
declare var expect: any

const apply = (
  actions: Array<Action>,
  initial = null
): ?SelectList<ConversationT> => {
  return actions.reduce(conversationsReducer, initial)
}

test('connection success creates conversation', () => {
  const id = 'fake'
  const list = apply([
    {
      type: 'REQUEST_CONNECTION_SUCCESS',
      connection: stubConnection(id)
    }
  ])

  expect(list).toBeDefined()
  if (list) {
    expect(list.length).toBe(1)
    expect(list.getSelected().type).toBe('CONNECTION')
    expect(list.getSelected().name).toBe(id)
  }
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
  expect(list).toBeDefined()
  if (list) {
    expect(list.getSelected().messages.length).toBe(1)
    expect(list.getSelected().messages[0].type).toBe('join')
    expect(list.getSelected().people.length).toBe(1)
  }
})

test('RECEIVE_QUIT removes someone from relevant convos and messages the channels', () => {
  const channel = '#jest'
  const nick = 'matt'

  let list = apply(
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

  expect(list).toBeDefined()
  if (list) {
    expect(list.length).toBe(2)

    list = list.selectWhere(c => c.name === channel)
    const convo = list.getSelected()

    expect(convo.messages.length).toBe(2)
    expect(convo.messages[1].type).toBe('quit')
    expect(convo.people.length).toBe(0)
  }
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

  expect(list).toBeDefined()
  if (list) {
    expect(list.length).toBe(2)
    expect(list.toArray()[1].type).toBe('CHANNEL')
  }
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

  expect(list).toBeDefined()
  if (list) {
    expect(list.length).toBe(2)
  }
})

test('NOTIFICATION_CLICK selects the convo', () => {
  const notifFrom = 'enemy'
  const list = apply(
    withConnection([
      {
        type: 'RECEIVE_DIRECT_MESSAGE',
        connectionId,
        from: 'friend',
        message: 'hi'
      },
      {
        type: 'RECEIVE_DIRECT_MESSAGE',
        connectionId,
        from: notifFrom,
        message: 'hi'
      },
      {
        type: 'NOTIFICATION_CLICK',
        via: {
          type: 'RECEIVE_DIRECT_MESSAGE',
          connectionId,
          from: notifFrom,
          message: 'hi'
        }
      }
    ])
  )
  expect(list).toBeDefined()
  if (list) {
    expect(list.getSelected().name).toEqual(notifFrom)
  }
})

function stubConnection(id) {
  return {
    id,
    isConnected: true,
    isWelcome: true,
    nickname: 'string',
    realName: 'string',
    server: 'string',
    port: 6667,
    stream: {
      join: s => {},
      nick: s => {},
      send: (to: string, msg: string) => {},
      notice: (a: string, b: string) => {},
      action: (target: string, msg: string) => {},
      part: (channel: Array<string>) => {},
      quit: (msg: string) => {}
    },
    error: null,
    conversations: null
  }
}

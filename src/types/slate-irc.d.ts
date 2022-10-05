declare module 'slate-irc' {
  import net from 'net'
  import { EventEmitter as Emitter } from 'events'

  export default class Client extends Emitter {
    constructor(stream: net.Socket /*parser, encoding */): void

    write(str: string, fn: (error: Error) => void): void

    pass(password: string): void
    nick(nickname: string): void
    user(nickname: string, realName: string): void
    // on
  }
}

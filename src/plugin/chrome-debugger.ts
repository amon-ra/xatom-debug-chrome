'use babel'

import { EventEmitter }  from 'events'
import { ChromeDebuggingProtocol }  from '/Users/willyelm/Github/chrome-debugging-protocol/lib/chrome-debugging-protocol'
import { dirname } from 'path'

export class ChromeDebugger {
  private protocol: ChromeDebuggingProtocol
  // constructor () {}
  async connect (socketUrl: string) {
    this.protocol = new ChromeDebuggingProtocol(socketUrl)
    var { Console } = await this.protocol.connect()
    Console.enabled()
  }
  getPages () {

  }
}

'use babel'

import { EventEmitter }  from 'events'
import { ChromeDebuggingProtocol }  from '/Users/willyelm/Github/chrome-debugging-protocol/lib/chrome-debugging-protocol'
import { dirname } from 'path'

export class ChromeDebugger {
  private protocol: ChromeDebuggingProtocol
  // constructor () {}
  async connect (socketUrl: string) {
    this.protocol = new ChromeDebuggingProtocol(socketUrl)
    var { Console, Debugger, Page } = await this.protocol.connect()
    await Console.enable()
    await Debugger.enable()
    await Debugger.setBreakpointsActive({
      active: true
    })
    await Page.navigate({
      url: 'http://127.0.0.1:8080'
    })
    // Debugger.scriptParsed((params) => {
    //   console.log('script parsed', params)
    // })
  }
  async disconnect () {
    if (this.protocol) {
      this.protocol.disconnect()
      this.protocol = null
    }
  }
  getPages () {

  }
}

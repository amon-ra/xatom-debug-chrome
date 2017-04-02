'use babel'

import { ChromeLauncher } from './chrome-launcher'
import { ChromeDebugger } from './chrome-debugger'
import { ChromeOptions } from './chrome-options'

export class ChromePlugin {
  private pluginClient: any
  private launcher: ChromeLauncher = new ChromeLauncher()
  private debugger: ChromeDebugger = new ChromeDebugger()
  public options: Object = ChromeOptions
  public name: String = 'Google Chrome'
  public iconPath: String = 'atom://atom-bugs-chrome/icons/chrome.svg'
  constructor () {
    // launcher listeners
    this.launcher.didStop(() => this.pluginClient.stop())
  }
  register (client) {
    this.pluginClient = client
  }
  async didRun () {
    this.pluginClient.console.clear()
    // run chrome
    this.launcher.hostName = 'localhost'
    this.launcher.portNumber = 9222
    let socketUrl = await this.launcher.start()
    this.debugger.connect(socketUrl)
    // set client as run
    this.pluginClient.run()
  }
  async didStop () {
    this.debugger.disconnect()
    this.launcher.stop()
    this.pluginClient.stop()
  }
  async didResume () {

  }
  async didPause () {

  }
  async didAddBreakpoint (filePath, lineNumber) {

  }
  async didRemoveBreakpoint (filePath, lineNumber) {

  }
  async didStepOver () {

  }
  async didStepInto () {

  }
  async didStepOut () {

  }
  async didRequestProperties (request, propertyView) {

  }
  async didEvaluateExpression (expression: string, evaluationView) {

  }
}

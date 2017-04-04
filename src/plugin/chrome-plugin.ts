import { ChromeDebuggingProtocolPlugin } from 'atom-bugs-chrome-debugger/lib/plugin'
import { ChromeLauncher } from './chrome-launcher'
import { ChromeDebugger } from './chrome-debugger'
import { BinaryType, ChromeOptions } from './chrome-options'
import { join } from 'path'

export class ChromePlugin extends ChromeDebuggingProtocolPlugin {

  public options: Object = ChromeOptions
  public name: String = 'Google Chrome'
  public iconPath: String = 'atom://atom-bugs-chrome/icons/chrome.svg'
  public launcher: ChromeLauncher = new ChromeLauncher()
  public debugger: ChromeDebugger = new ChromeDebugger()

  constructor () {
    super()
    this.addEventListeners()
  }
  didLoad () {
    // reload page to activate breakpoints
    this.debugger.domains.Page.reload()
  }
  async didRun () {
    this.pluginClient.console.clear()
    let options = await this.pluginClient.getOptions()
    // run chrome
    this.launcher.hostName = 'localhost'
    this.launcher.portNumber = options.portNumber
    if (options.binaryPath === BinaryType.Custom) {
      this.launcher.customBinaryPath = options.customBinaryPath
    }
    let projectPath = this.pluginClient.getPath()
    let contextPath = join(projectPath, options.basePath)
    this.debugger.basePath = projectPath
    this.debugger.serverUrl = options.serverUrl

    this.debugger.mappingPaths = {}
    this.debugger.mappingPaths[options.serverUrl] = contextPath
    this.debugger.mappingPaths[contextPath] = options.serverUrl
    // add defined mappings
    Object
      .keys(options.mappingPaths || {})
      .forEach((origin) => {
        this.debugger.mappingPaths[origin] = join(projectPath, '/', options.mappingPaths[origin])
      })

    let socketUrl = await this.launcher.start()
    await this.debugger.connect(socketUrl)
    await this.debugger.domains.Page.navigate({
      url: options.serverUrl
    })
    // set toolbar as run
    this.pluginClient.run()
  }
}

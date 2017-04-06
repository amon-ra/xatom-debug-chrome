import { ChromeDebuggingProtocolPlugin } from 'atom-bugs-chrome-debugger/lib/plugin'
import { ChromeLauncher } from './chrome-launcher'
import { ChromeDebugger } from './chrome-debugger'
import { BinaryType, ChromeOptions } from './chrome-options'
import { normalize, join } from 'path'

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

  didLaunchError (message: string) {
    atom.notifications.addError('Atom Bugs: Google Chrome', {
      detail: `Launcher error: ${message}`,
      dismissable: true
    })
  }

  async didRun () {
    this.pluginClient.console.clear()
    let options = await this.pluginClient.getOptions()
    // run chrome
    this.launcher.hostName = 'localhost'
    this.launcher.portNumber = options.portNumber
    if (options.binaryPath === BinaryType.Custom) {
      this.launcher.customBinaryPath = options.customBinaryPath
    } else {
      this.launcher.customBinaryPath = null
    }
    let projectPath = this.pluginClient.getPath()
    let contextPath = join(projectPath, options.basePath)
    this.debugger.basePath = projectPath
    this.debugger.serverUrl = options.serverUrl

    this.debugger.setMappings({})
    this.debugger.addMapping(options.serverUrl, contextPath)
    this.debugger.addMapping(contextPath, options.serverUrl)
    let defaultMappings = {
      'webpack:///': '.',
      'webpack:///~/': './node_modules'
    }
    // add defined mappings
    Object.assign(defaultMappings, options.mappingPaths)
    Object
      .keys(defaultMappings)
      .forEach((origin) => {
        this.debugger.addMapping(origin, normalize(join(projectPath, '/', defaultMappings[origin], '/')))
      })

    this.launcher.url = options.serverUrl
    this.disableConsole()
    let socketUrl = await this.launcher.start()
    if (socketUrl) {
      this.pluginClient.run()
      await this.debugger.connect(socketUrl)
      this.enableConsole()
      await this.debugger.domains.Page.reload()
    }
  }
}

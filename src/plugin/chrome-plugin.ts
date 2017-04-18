import { ChromeDebuggingProtocolPlugin } from 'xatom-debug-chrome-base/lib/plugin'
import { ChromeLauncher } from './chrome-launcher'
import { ChromeDebugger } from './chrome-debugger'
import { BinaryType, ChromeOptions } from './chrome-options'
import { normalize, join } from 'path'
import { trimEnd } from 'lodash'

export class ChromePlugin extends ChromeDebuggingProtocolPlugin {

  public options: Object = ChromeOptions
  public name: String = 'Google Chrome'
  public iconPath: String = 'atom://xatom-debug-chrome/icons/chrome.svg'
  public launcher: ChromeLauncher = new ChromeLauncher()
  public debugger: ChromeDebugger = new ChromeDebugger()

  constructor () {
    super()
    this.addEventListeners()
  }

  didLaunchError (message: string) {
    atom.notifications.addError('XAtom Debug: Google Chrome', {
      detail: `Launcher error: ${message}`,
      dismissable: true
    })
  }

  async didRun () {
    try {
      this.pluginClient.status.startLoading()
      this.pluginClient.status.update('Running chrome')
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
      let projectPath = trimEnd(this.pluginClient.getPath(), '/')
      let contextPath = join(projectPath, trimEnd(options.basePath, '/'))
      this.debugger.basePath = projectPath
      this.debugger.serverUrl = trimEnd(options.serverUrl, ['/', ' '] as any)

      this.debugger.setMappings({})
      this.debugger.addMapping(this.debugger.serverUrl, contextPath)
      this.debugger.addMapping(contextPath, this.debugger.serverUrl)
      let defaultMappings = {
        'webpack:///./': '.',
        'webpack:///./~/': './node_modules'
      }
      // add defined mappings
      Object.assign(defaultMappings, options.mappingPaths)
      Object
        .keys(defaultMappings)
        .forEach((origin) => {
          this.debugger.addMapping(origin, normalize(join(projectPath, '/', defaultMappings[origin], '/')))
        })

      this.launcher.url = this.debugger.serverUrl
      this.disableConsole()
      let socketUrl = await this.launcher.start()
      if (socketUrl) {
        this.pluginClient.status.update('Connecting to Debugger')
        this.pluginClient.run()
        await this.debugger.connect(socketUrl).then(() => {
          this.pluginClient.status.update('Debugger Attached', 'status-success')
          this.pluginClient.status.stopLoading()
          this.enableConsole()
        })
        // await this.debugger.domains.Page.reload()
      }
    } catch (e) {
      this.pluginClient.status.update(e, 'status-error')
      this.pluginClient.status.stopLoading()
    }
  }
}

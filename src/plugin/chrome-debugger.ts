import { ChromeDebuggingProtocolDebugger } from '/Users/willyelm/Github/atom-bugs-chrome-debugger/lib/debugger'
import { join, normalize } from 'path'

export class ChromeDebugger extends ChromeDebuggingProtocolDebugger {
  public basePath: string
  public mappingPaths: Object = {}
  public serverUrl: string
  constructor () {
    super()
  }
  setMappings (value: Object) {
    this.mappingPaths = value || {}
  }
  addMapping(mappingPath: string, mappingTarget: string) {
    this.mappingPaths[mappingPath] = mappingTarget
  }
  getFilePathFromUrl (fileUrl: string): string {
    let filePath = fileUrl
    Object
      .keys(this.mappingPaths)
      .forEach((origin) => {
        let target = this.mappingPaths[origin]
        if (fileUrl.match(new RegExp(`^${origin}`))) {
          let isUrl = target.match(/(http|https|ws):\/\//)
          if (isUrl) {
            filePath = fileUrl
              .replace(origin, target)
              // .replace(/\?(.+)$/, '')
              .replace(/([^:]\/)\/+/g, "$1")
          } else {
            let pathTarget = normalize(join(target, '/'))
            filePath = fileUrl.replace(origin, pathTarget)
          }
        }
      })
    return filePath
  }
  async didConnect (domains): Promise<any> {
    var { Runtime, Debugger, Page } = domains
    Debugger.paused(() => {
      Page.configureOverlay({
        message: 'Paused from Atom Bugs'
      })
    })
    Debugger.resumed(() => {
      Page.configureOverlay({})
    })
    return await Promise.all([
      Page.enable(),
      Runtime.enable(),
      Debugger.enable(),
      Debugger.setBreakpointsActive({
        active: true
      })
    ])
  }
}

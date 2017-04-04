import { ChromeDebuggingProtocolDebugger } from 'atom-bugs-chrome-debugger/lib/debugger'
import { join, normalize } from 'path'

export class ChromeDebugger extends ChromeDebuggingProtocolDebugger {
  public basePath: string
  public mappingPaths: Object
  public serverUrl: string
  constructor () {
    super()
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
    // console.log('transform', fileUrl, filePath)
    return filePath
  }
  getFeatures (): Array<Promise<any>> {
    var {
      Profiler,
      Runtime,
      Debugger,
      Page
    } = this.domains
    Debugger.paused(() => {
      Page.configureOverlay({
        message: 'Paused from Atom Bugs'
      })
    })
    Debugger.resumed(() => {
      Page.configureOverlay({})
    })
    return [
      Page.enable(),
      Runtime.enable(),
      Debugger.enable(),
      Debugger.setBreakpointsActive({
        active: true
      })
    ]
  }
}

import { ChromeDebuggingProtocolDebugger } from 'atom-bugs-chrome-debugger/lib/debugger'

export class ChromeDebugger extends ChromeDebuggingProtocolDebugger {
  public domains: any
  public contextPath: string
  public serverUrl: string
  constructor () {
    super()
  }
  getFilePathFromUrl (fileUrl: string): string {
    let filePath = fileUrl.replace(this.serverUrl, this.contextPath)
    return filePath
  }
  getUrlFromFilePath (filePath: string) {
    let fileUrl = filePath.replace(this.contextPath, this.serverUrl)
    return fileUrl
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

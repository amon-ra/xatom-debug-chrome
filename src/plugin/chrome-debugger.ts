import { ChromeDebuggingProtocolDebugger } from 'xatom-debug-chrome-base/lib/debugger'
import { join, normalize } from 'path'
import { trimStart, trimEnd, escapeRegExp } from 'lodash'
import { resolve as resolveUrl } from 'url'
import { trimPathChars } from './chrome-options'

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
        if (fileUrl.match(new RegExp(`^${escapeRegExp(origin)}`))) {
          let isUrl = target.match(/(http|https|ws):\/\//)
          if (isUrl) {
            let urlRelative = fileUrl
              .replace(origin, '')
              // .replace(/\?(.+)$/, '')
              .replace(/([^:]\/)\/+/g, "$1")
            filePath = resolveUrl(target, trimStart(urlRelative, trimPathChars))
          } else {
            let pathTarget = normalize(trimEnd(target, trimPathChars))
            let fileRelativePath = trimStart(fileUrl.replace(origin, ''), trimPathChars)
            filePath = join(pathTarget, fileRelativePath)
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
      // Runtime.runIfWaitingForDebugger(),
      Debugger.enable(),
      // Debugger.setPauseOnExceptions({ state: 'none' }),
      // Debugger.setAsyncCallStackDepth({ maxDepth: 0 }),
      // Debugger.setBreakpointsActive({
      //   active: true
      // })
    ])
  }
}

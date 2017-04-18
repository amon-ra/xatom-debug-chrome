import { ChromeDebuggingProtocolLauncher } from 'xatom-debug-chrome-base/lib/launcher'
import { type, arch, platform } from 'os'
import { includes, isEqual, trimEnd } from 'lodash'

export interface Page {
  type: string,
  url: string,
  webSocketDebuggerUrl?: string
}

export type Pages = Array<Page>

export class ChromeLauncher extends ChromeDebuggingProtocolLauncher {
  public hostName: string
  public portNumber: number
  public customBinaryPath: string
  public url: string
  findPageUrl (page): boolean {
    return (isEqual(trimEnd(page.url, ['/', ' '] as any), this.url)
      && page.type === 'page'
      && page.webSocketDebuggerUrl)
  }
  getLauncherArguments () {
    let chromeArgs = [
      `--remote-debugging-address=${this.hostName}`,
      `--remote-debugging-port=${this.portNumber}`,
      // '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      // '--num-raster-threads=4'
    ]
    if (includes(['darwin', 'linux'], platform())) {
      chromeArgs.push('--user-data-dir=$(mktemp -d -t \'chrome-remote_data_dir\')')
    }
    if (this.url) {
      chromeArgs.push(this.url)
    }
    return chromeArgs
  }
  getBinaryPath (): string {
    let binary = '/usr/bin/google-chrome'
    if (this.customBinaryPath) {
      binary = this.customBinaryPath
    } else {
      switch (type()) {
        case 'Darwin':
          binary = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          break
        case 'Linux':
          binary = '/usr/bin/google-chrome'
          break
        case 'Windows_NT':
          let osArch = arch()
          if (osArch === 'x86') {
            binary = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
          } else {
            binary = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          }
          break
      }
    }
    return this.quote(binary)
  }
}

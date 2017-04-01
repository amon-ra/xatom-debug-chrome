'use babel'

import { EventEmitter }  from 'events'
import { spawn, ChildProcess } from 'child_process'
import { request } from 'http'
import { type, arch } from 'os'

export interface Page {
  type: string,
  url: string,
  webSocketDebuggerUrl?: string
}

export type Pages = Array<Page>

export class ChromeLauncher {
  public portNumber: number
  public hostName: string
  private process: ChildProcess
  private maxAttempts: number = 3
  private attempt: number = 0
  private events: EventEmitter = new EventEmitter()
  // Events
  didStop (cb) {
    this.events.on('didStop', cb)
  }
  didFail (cb) {
    this.events.on('didFail', cb)
  }
  didReceiveOutput(cb) {
    this.events.on('didReceiveOutput', cb)
  }
  didReceiveError(cb) {
    this.events.on('didReceiveError', cb)
  }
  // Actions
  stop () {
    this.process.kill()
    this.events.emit('didStop')
  }
  start (): Promise<string> {
    let launchArgs = [
      `--remote-debugging-address=${this.hostName}`,
      `--remote-debugging-port=${this.portNumber}`,
      '--no-first-run',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      '--no-default-browser-check',
      '--num-raster-threads=4',
      '--user-data-dir=$(mktemp -d -t \'chrome-remote_data_dir\')'
    ]
    let binaryPath = this.getBinaryPath()
    this.process = spawn(binaryPath, launchArgs, {
      shell: true
    })
    this.process.stdout.on('data', (res: Uint8Array) => {
      this.events.emit('didReceiveOutput')
    })
    this.process.stderr.on('data', (res: Uint8Array) => {
      console.log(res.toString())
      this.events.emit('didReceiveError')
    })
    this.process.on('close', (code) => {
      if (code !== 0) {
        this.events.emit('didFail')
      }
      this.events.emit('didStop')
    })
    return this.findSocketUrl()
  }
  getBinaryPath (): string {
    let binary = '/usr/bin/google-chrome'
    switch (type()) {
      case 'Darwin':
        binary = '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome'
        break
      case 'Linux':
        binary = '/usr/bin/google-chrome'
        break
      case 'Windows_NT':
        let osArch = arch()
        if (osArch === 'x86') {
          binary = 'C:\\Program\ Files\ (x86)\\Google\\Chrome\\Application\\chrome.exe'
        } else {
          binary = 'C:\\Program\ Files\\Google\\Chrome\\Application\\chrome.exe'
        }
        break
    }
    return binary
  }
  getPages (): Promise<Pages> {
    return new Promise((resolve, reject) => {
      let req = request({
        hostname: this.hostName,
        port: this.portNumber,
        path: '/json',
        method: 'GET'
      }, (res) => {
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          try {
            resolve(JSON.parse(String(chunk)) as Pages)
          } catch (e) {
            reject(e)
          }
        })
      })
      req.on('error', reject)
      req.end()
    })
  }
  findSocketUrl (): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        let pages = await this
          .getPages()
          .catch(() => {
            if (this.attempt <= this.maxAttempts) {
              resolve(this.findSocketUrl())
            } else {
              reject('unable to get pages')
            }
          })
        let found = (pages || []).find((page: Page) => {
          return (page.url === 'chrome://newtab/')
        })
        if (found) {
          resolve(found.webSocketDebuggerUrl)
        } else {
          reject('unable to find page with socket')
        }
      }, 500)
    })
  }
}

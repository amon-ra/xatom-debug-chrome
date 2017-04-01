'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from 'events';
import { spawn } from 'child_process';
import { request } from 'http';
import { type, arch } from 'os';
export class ChromeLauncher {
    constructor() {
        this.maxAttempts = 3;
        this.attempt = 0;
        this.events = new EventEmitter();
    }
    didStop(cb) {
        this.events.on('didStop', cb);
    }
    didFail(cb) {
        this.events.on('didFail', cb);
    }
    didReceiveOutput(cb) {
        this.events.on('didReceiveOutput', cb);
    }
    didReceiveError(cb) {
        this.events.on('didReceiveError', cb);
    }
    stop() {
        this.process.kill();
        this.events.emit('didStop');
    }
    start() {
        let launchArgs = [
            `--remote-debugging-address=${this.hostName}`,
            `--remote-debugging-port=${this.portNumber}`,
            '--no-first-run',
            '--disable-extensions',
            '--disable-component-extensions-with-background-pages',
            '--no-default-browser-check',
            '--num-raster-threads=4',
            '--user-data-dir=$(mktemp -d -t \'chrome-remote_data_dir\')'
        ];
        let binaryPath = this.getBinaryPath();
        this.process = spawn(binaryPath, launchArgs, {
            shell: true
        });
        this.process.stdout.on('data', (res) => {
            this.events.emit('didReceiveOutput');
        });
        this.process.stderr.on('data', (res) => {
            console.log(res.toString());
            this.events.emit('didReceiveError');
        });
        this.process.on('close', (code) => {
            if (code !== 0) {
                this.events.emit('didFail');
            }
            this.events.emit('didStop');
        });
        return this.findSocketUrl();
    }
    getBinaryPath() {
        let binary = '/usr/bin/google-chrome';
        switch (type()) {
            case 'Darwin':
                binary = '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome';
                break;
            case 'Linux':
                binary = '/usr/bin/google-chrome';
                break;
            case 'Windows_NT':
                let osArch = arch();
                if (osArch === 'x86') {
                    binary = 'C:\\Program\ Files\ (x86)\\Google\\Chrome\\Application\\chrome.exe';
                }
                else {
                    binary = 'C:\\Program\ Files\\Google\\Chrome\\Application\\chrome.exe';
                }
                break;
        }
        return binary;
    }
    getPages() {
        return new Promise((resolve, reject) => {
            let req = request({
                hostname: this.hostName,
                port: this.portNumber,
                path: '/json',
                method: 'GET'
            }, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    try {
                        resolve(JSON.parse(String(chunk)));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', reject);
            req.end();
        });
    }
    findSocketUrl() {
        return new Promise((resolve, reject) => {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let pages = yield this
                    .getPages()
                    .catch(() => {
                    if (this.attempt <= this.maxAttempts) {
                        resolve(this.findSocketUrl());
                    }
                    else {
                        reject('unable to get pages');
                    }
                });
                let found = (pages || []).find((page) => {
                    return (page.url === 'chrome://newtab/');
                });
                if (found) {
                    resolve(found.webSocketDebuggerUrl);
                }
                else {
                    reject('unable to find page with socket');
                }
            }), 500);
        });
    }
}
//# sourceMappingURL=chrome-launcher.js.map
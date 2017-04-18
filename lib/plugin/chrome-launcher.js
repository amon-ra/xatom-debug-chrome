"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var launcher_1 = require("xatom-debug-chrome-base/lib/launcher");
var os_1 = require("os");
var lodash_1 = require("lodash");
var chrome_options_1 = require("./chrome-options");
var ChromeLauncher = (function (_super) {
    __extends(ChromeLauncher, _super);
    function ChromeLauncher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChromeLauncher.prototype.findPageUrl = function (page) {
        return (lodash_1.isEqual(lodash_1.trimEnd(page.url, chrome_options_1.trimPathChars), this.url)
            && page.type === 'page'
            && page.webSocketDebuggerUrl);
    };
    ChromeLauncher.prototype.getLauncherArguments = function () {
        var chromeArgs = [
            "--remote-debugging-address=" + this.hostName,
            "--remote-debugging-port=" + this.portNumber,
            '--no-default-browser-check',
            '--disable-extensions',
            '--disable-component-extensions-with-background-pages',
        ];
        if (lodash_1.includes(['darwin', 'linux'], os_1.platform())) {
            chromeArgs.push('--user-data-dir=$(mktemp -d -t \'chrome-remote_data_dir\')');
        }
        if (this.url) {
            chromeArgs.push(this.url);
        }
        return chromeArgs;
    };
    ChromeLauncher.prototype.getBinaryPath = function () {
        var binary = '/usr/bin/google-chrome';
        if (this.customBinaryPath) {
            binary = this.customBinaryPath;
        }
        else {
            switch (os_1.type()) {
                case 'Darwin':
                    binary = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
                    break;
                case 'Linux':
                    binary = '/usr/bin/google-chrome';
                    break;
                case 'Windows_NT':
                    var osArch = os_1.arch();
                    if (osArch === 'x86') {
                        binary = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
                    }
                    else {
                        binary = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
                    }
                    break;
            }
        }
        return this.quote(binary);
    };
    return ChromeLauncher;
}(launcher_1.ChromeDebuggingProtocolLauncher));
exports.ChromeLauncher = ChromeLauncher;
//# sourceMappingURL=chrome-launcher.js.map
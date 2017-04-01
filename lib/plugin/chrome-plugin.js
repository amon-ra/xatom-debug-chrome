'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChromeLauncher } from './chrome-launcher';
import { ChromeDebugger } from './chrome-debugger';
import { ChromeOptions } from './chrome-options';
export class ChromePlugin {
    constructor() {
        this.launcher = new ChromeLauncher();
        this.debugger = new ChromeDebugger();
        this.options = ChromeOptions;
        this.name = 'Google Chrome';
        this.iconPath = 'atom://atom-bugs-chrome/icons/chrome.svg';
        this.launcher.didStop(() => this.pluginClient.stop());
    }
    register(client) {
        this.pluginClient = client;
    }
    didRun() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pluginClient.console.clear();
            this.launcher.hostName = 'localhost';
            this.launcher.portNumber = 9222;
            let socketUrl = yield this.launcher.start();
            this.debugger.connect(socketUrl);
            this.pluginClient.run();
        });
    }
    didStop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.launcher.stop();
            this.pluginClient.stop();
        });
    }
    didResume() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    didPause() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    didAddBreakpoint(filePath, lineNumber) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    didRemoveBreakpoint(filePath, lineNumber) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    didStepOver() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    didStepInto() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    didStepOut() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    didRequestProperties(request, propertyView) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    didEvaluateExpression(expression, evaluationView) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
//# sourceMappingURL=chrome-plugin.js.map
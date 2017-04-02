'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChromeDebuggingProtocol } from '/Users/willyelm/Github/chrome-debugging-protocol/lib/chrome-debugging-protocol';
export class ChromeDebugger {
    connect(socketUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            this.protocol = new ChromeDebuggingProtocol(socketUrl);
            var { Console, Debugger, Page } = yield this.protocol.connect();
            yield Console.enable();
            yield Debugger.enable();
            yield Debugger.setBreakpointsActive({
                active: true
            });
            yield Page.navigate({
                url: 'http://127.0.0.1:8080'
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.protocol) {
                this.protocol.disconnect();
                this.protocol = null;
            }
        });
    }
    getPages() {
    }
}
//# sourceMappingURL=chrome-debugger.js.map
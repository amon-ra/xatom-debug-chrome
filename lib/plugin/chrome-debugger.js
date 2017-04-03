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
var debugger_1 = require("atom-bugs-chrome-debugger/lib/debugger");
var ChromeDebugger = (function (_super) {
    __extends(ChromeDebugger, _super);
    function ChromeDebugger() {
        return _super.call(this) || this;
    }
    ChromeDebugger.prototype.getFilePathFromUrl = function (fileUrl) {
        var filePath = fileUrl.replace(this.serverUrl, this.contextPath);
        return filePath;
    };
    ChromeDebugger.prototype.getUrlFromFilePath = function (filePath) {
        var fileUrl = filePath.replace(this.contextPath, this.serverUrl);
        return fileUrl;
    };
    ChromeDebugger.prototype.getFeatures = function () {
        var _a = this.domains, Profiler = _a.Profiler, Runtime = _a.Runtime, Debugger = _a.Debugger, Page = _a.Page;
        Debugger.paused(function () {
            Page.configureOverlay({
                message: 'Paused from Atom Bugs'
            });
        });
        Debugger.resumed(function () {
            Page.configureOverlay({});
        });
        return [
            Page.enable(),
            Runtime.enable(),
            Debugger.enable(),
            Debugger.setBreakpointsActive({
                active: true
            })
        ];
    };
    return ChromeDebugger;
}(debugger_1.ChromeDebuggingProtocolDebugger));
exports.ChromeDebugger = ChromeDebugger;
//# sourceMappingURL=chrome-debugger.js.map
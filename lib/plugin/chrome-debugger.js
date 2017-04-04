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
var path_1 = require("path");
var ChromeDebugger = (function (_super) {
    __extends(ChromeDebugger, _super);
    function ChromeDebugger() {
        return _super.call(this) || this;
    }
    ChromeDebugger.prototype.getFilePathFromUrl = function (fileUrl) {
        var _this = this;
        var filePath = fileUrl;
        Object
            .keys(this.mappingPaths)
            .forEach(function (origin) {
            var target = _this.mappingPaths[origin];
            if (fileUrl.match(new RegExp("^" + origin))) {
                var isUrl = target.match(/(http|https|ws):\/\//);
                if (isUrl) {
                    filePath = fileUrl
                        .replace(origin, target)
                        .replace(/([^:]\/)\/+/g, "$1");
                }
                else {
                    var pathTarget = path_1.normalize(path_1.join(target, '/'));
                    filePath = fileUrl.replace(origin, pathTarget);
                }
            }
        });
        return filePath;
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
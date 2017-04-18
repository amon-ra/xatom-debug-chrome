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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_1 = require("xatom-debug-chrome-base/lib/plugin");
var chrome_launcher_1 = require("./chrome-launcher");
var chrome_debugger_1 = require("./chrome-debugger");
var chrome_options_1 = require("./chrome-options");
var path_1 = require("path");
var lodash_1 = require("lodash");
var ChromePlugin = (function (_super) {
    __extends(ChromePlugin, _super);
    function ChromePlugin() {
        var _this = _super.call(this) || this;
        _this.options = chrome_options_1.ChromeOptions;
        _this.name = 'Google Chrome';
        _this.iconPath = 'atom://xatom-debug-chrome/icons/chrome.svg';
        _this.launcher = new chrome_launcher_1.ChromeLauncher();
        _this.debugger = new chrome_debugger_1.ChromeDebugger();
        _this.addEventListeners();
        return _this;
    }
    ChromePlugin.prototype.didLaunchError = function (message) {
        atom.notifications.addError('XAtom Debug: Google Chrome', {
            detail: "Launcher error: " + message,
            dismissable: true
        });
    };
    ChromePlugin.prototype.didRun = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var options, projectPath_1, contextPath, defaultMappings_1, socketUrl, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        this.pluginClient.status.startLoading();
                        this.pluginClient.status.update('Running chrome');
                        this.pluginClient.console.clear();
                        return [4, this.pluginClient.getOptions()];
                    case 1:
                        options = _a.sent();
                        this.launcher.hostName = 'localhost';
                        this.launcher.portNumber = options.portNumber;
                        if (options.binaryPath === chrome_options_1.BinaryType.Custom) {
                            this.launcher.customBinaryPath = options.customBinaryPath;
                        }
                        else {
                            this.launcher.customBinaryPath = null;
                        }
                        projectPath_1 = this.pluginClient.getPath();
                        contextPath = path_1.join(projectPath_1, options.basePath);
                        this.debugger.basePath = projectPath_1;
                        this.debugger.serverUrl = lodash_1.trimEnd(options.serverUrl, ['/', ' ']);
                        this.debugger.setMappings({});
                        this.debugger.addMapping(this.debugger.serverUrl, contextPath);
                        this.debugger.addMapping(contextPath, this.debugger.serverUrl);
                        defaultMappings_1 = {
                            'webpack:///./': '.',
                            'webpack:///./~/': './node_modules'
                        };
                        Object.assign(defaultMappings_1, options.mappingPaths);
                        Object
                            .keys(defaultMappings_1)
                            .forEach(function (origin) {
                            _this.debugger.addMapping(origin, path_1.normalize(path_1.join(projectPath_1, '/', defaultMappings_1[origin], '/')));
                        });
                        this.launcher.url = this.debugger.serverUrl;
                        this.disableConsole();
                        return [4, this.launcher.start()];
                    case 2:
                        socketUrl = _a.sent();
                        if (!socketUrl) return [3, 4];
                        this.pluginClient.status.update('Connecting to Debugger');
                        this.pluginClient.run();
                        return [4, this.debugger.connect(socketUrl).then(function () {
                                _this.pluginClient.status.update('Debugger Attached', 'status-success');
                                _this.pluginClient.status.stopLoading();
                                _this.enableConsole();
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3, 6];
                    case 5:
                        e_1 = _a.sent();
                        this.pluginClient.status.update(e_1, 'status-error');
                        this.pluginClient.status.stopLoading();
                        return [3, 6];
                    case 6: return [2];
                }
            });
        });
    };
    return ChromePlugin;
}(plugin_1.ChromeDebuggingProtocolPlugin));
exports.ChromePlugin = ChromePlugin;
//# sourceMappingURL=chrome-plugin.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chrome_plugin_1 = require("./plugin/chrome-plugin");
var _a = require('atom'), CompositeDisposable = _a.CompositeDisposable, Disposable = _a.Disposable;
module.exports = {
    pluginManager: null,
    plugin: null,
    consumeBugsService: function (pluginManager) {
        this.plugin = new chrome_plugin_1.ChromePlugin();
        this.pluginManager = pluginManager;
        this.pluginManager.addPlugin(this.plugin);
    },
    activate: function () {
        require('atom-package-deps').install('atom-bugs-chrome', true);
    },
    deactivate: function () {
        if (this.plugin) {
            this.plugin.didStop();
        }
        if (this.pluginManager) {
            this.pluginManager.removePlugin(this.plugin);
        }
    }
};
//# sourceMappingURL=main.js.map
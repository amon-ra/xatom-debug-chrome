import { ChromePlugin } from './plugin/chrome-plugin'
const { CompositeDisposable, Disposable } = require('atom')

module.exports = {
  pluginManager: null,
  plugin: null,
  consumeBugsService (pluginManager) {
    this.plugin = new ChromePlugin()
    this.pluginManager = pluginManager
    this.pluginManager.addPlugin(this.plugin)
  },
  activate () {
    require('atom-package-deps').install('atom-bugs-chrome', true)
  },
  deactivate () {
    if (this.plugin) {
      this.plugin.didStop()
    }
    if (this.pluginManager) {
      this.pluginManager.removePlugin(this.plugin)
    }
  }
}

'use babel'

import { ChromePlugin } from './plugin/chrome-plugin'
const { CompositeDisposable, Disposable } = require('atom')

export default {
  pluginManager: null,
  plugin: null,
  consumeBugsService (pluginManager) {
    this.plugin = new ChromePlugin()
    this.pluginManager = pluginManager
    this.pluginManager.addPlugin(this.plugin)
  },
  activate () {
    require('atom-package-deps').install('atom-bugs-nodejs', true)
  },
  deactivate () {
    if (this.pluginManager) {
      this.pluginManager.removePlugin(this.plugin)
    }
  }
}

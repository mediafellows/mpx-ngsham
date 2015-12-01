namespace NgSham {

  /**
   * If true, NgSham adds three additional assets to the global namespace.
   * @type {boolean}
   */
  var SUPPORT_JAVASCRIPT: boolean = true;

  /**
   * Prevents users from calling bootstrap from Javascript.
   * @type {boolean}
   */
  export var IS_A_CLOSURE: boolean = true;

  if (SUPPORT_JAVASCRIPT) {
    /**
     * Exposes ngsham on the window, for Javascript consumption.
     * @param  {[type]} appName
     * @param  {[type]} angularVersion
     * @param  {[type]} componentsDir
     * @return {[type]}
     */
    window.ngshim = function (appName, angularVersion, componentsDir) {
      var sham = NgSham.NgShamFactory.getInstance();

      window.ngsham = sham.shim({
        appName: appName,
        angularVersion: angularVersion,
        componentsDir: componentsDir,
        forceUseComponentCreator: false
      }).bind(sham.componentCreator);

      window.ngshambles = sham.shim({
        appName: appName,
        angularVersion: angularVersion,
        componentsDir: componentsDir,
        forceUseComponentCreator: 'ComponentLegacy'
      }).bind(sham.componentCreator);
    }
  }

  /**
   * Shims Angular 2 bootstrap. Throws an error if called from Javascript.
   * @param  {[type]} controller [description]
   * @return {[type]}            [description]
   */
  export function bootstrap (controller) {
    if (this.IS_A_CLOSURE) throw new Error('It is forbidden to call bootstrap from Javascript.');
    NgShamFactory.getInstance.annotations2CDO(controller);
  }
}

module NgSham {

  /**
   * Exposes ngsham on the window, for Javascript consumption.
   * @param  {[type]} appName
   * @param  {[type]} angularVersion
   * @param  {[type]} componentsDir
   * @return {[type]}
   */
  window.ngshim = function (appName, angularVersion, componentsDir, verbose = false) {

    var sham = NgSham.NgShamFactory.getInstance();

    window.ngsham = sham.shim({
      appName: appName,
      angularVersion: angularVersion,
      componentsDir: componentsDir,
      forceUseComponentCreator: false,
      verbose: verbose
    }).bind(sham.componentCreator);

    window.ngshambles = sham.shim({
      appName: appName,
      angularVersion: angularVersion,
      componentsDir: componentsDir,
      forceUseComponentCreator: 'ComponentLegacy',
      verbose: verbose
    }).bind(sham.componentCreator);

    window.bootstrap = function (controller) {
      sham.shimb(controller);
    }.bind(sham.componentCreator);
  }
}

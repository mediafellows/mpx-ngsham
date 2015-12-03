var NgSham;
(function (NgSham) {
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
        window.bootstrap = function (controller) {
            sham.shimb(controller);
        }.bind(sham.componentCreator);
    };
})(NgSham || (NgSham = {}));

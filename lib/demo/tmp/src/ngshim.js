var NgSham;
(function (NgSham) {
    window.ngshim = function (appName, angularVersion, componentsDir, verbose) {
        if (verbose === void 0) { verbose = false; }
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
    };
})(NgSham || (NgSham = {}));

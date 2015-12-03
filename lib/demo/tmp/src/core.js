var NgSham;
(function (NgSham) {
    var NgShamFactory = (function () {
        function NgShamFactory() {
            if (NgShamFactory._instance)
                throw new Error('Singleton!');
            NgShamFactory._instance = this;
        }
        NgShamFactory.getInstance = function () {
            return NgShamFactory._instance;
        };
        NgShamFactory.prototype.configure = function (config) {
            this.config = config;
            this.componentCreator = new NgSham[typeof this.config.forceUseComponentCreator === 'string'
                ? this.config.forceUseComponentCreator
                : this.version()](this.config);
        };
        NgShamFactory.prototype.shim = function (config) {
            this.configure(config);
            return this.componentCreator.component;
        };
        NgShamFactory.prototype.shimb = function (controller) {
            this.componentCreator.bootstrap(controller);
        };
        NgShamFactory.prototype.version = function () {
            if (!this.config.angularVersion && window.angular)
                this.config.angularVersion = window.angular.version;
            if (this.config.angularVersion > 1.5)
                return 'ComponentTwoAlpha';
            else if (this.config.angularVersion == 1.5)
                return 'ComponentOneFive';
            else if (this.config.angularVersion >= 1.4)
                return 'ComponentOneFour';
            else if (this.config.angularVersion >= 1.3)
                return 'ComponentOneThree';
            else
                throw new Error('Angular versions less than 1.3 are not supported.');
        };
        NgShamFactory._instance = new NgShamFactory();
        return NgShamFactory;
    })();
    NgSham.NgShamFactory = NgShamFactory;
})(NgSham || (NgSham = {}));

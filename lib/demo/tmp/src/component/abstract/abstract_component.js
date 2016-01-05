var NgSham;
(function (NgSham) {
    var AbstractComponent = (function () {
        function AbstractComponent(config) {
            this.config = config;
        }
        AbstractComponent.prototype.component = function (name, CDOorFn) {
            this.name = name;
            this.CDO = typeof CDOorFn === 'function'
                ? NgSham.util.coerceToShamCDO({ selector: name, class: CDOorFn })
                : NgSham.util.coerceToShamCDO(CDOorFn);
            this.createComponent();
        };
        AbstractComponent.prototype.bootstrap = function (controller) {
            var CDO = NgSham.reflect.deAnnotate(controller);
            this.component(CDO.selector, CDO);
        };
        return AbstractComponent;
    })();
    NgSham.AbstractComponent = AbstractComponent;
})(NgSham || (NgSham = {}));

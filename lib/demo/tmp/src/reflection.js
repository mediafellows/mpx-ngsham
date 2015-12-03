var NgSham;
(function (NgSham) {
    var reflect;
    (function (reflect) {
        function deAnnotate(c) {
            var i = new c(), CDO = {
                selector: c.prototype.selector || '',
                ng1Name: c.prototype.ng1Name || '',
                restrict: c.prototype.restrict || '',
                templateUrl: c.prototype.templateUrl || false,
                properties: c.prototype.properties || [],
                events: c.prototype.events || [],
                host: c.prototype.host || [],
                class: c,
                inject: c.prototype.inject || [],
                annotations: c.prototype.annotations || {},
                autoNamespace: c.prototype.autoNamespace || true,
                isDecorator: c.prototype.isDecorator || true,
            };
            return CDO;
        }
        reflect.deAnnotate = deAnnotate;
    })(reflect = NgSham.reflect || (NgSham.reflect = {}));
})(NgSham || (NgSham = {}));

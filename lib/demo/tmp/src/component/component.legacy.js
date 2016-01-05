var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NgSham;
(function (NgSham) {
    var ComponentLegacy = (function (_super) {
        __extends(ComponentLegacy, _super);
        function ComponentLegacy() {
            _super.apply(this, arguments);
        }
        ComponentLegacy.prototype.DDO = function () {
            var DDO = {
                restrict: this.CDO.restrict,
                controller: this.inject(this.CDO.class, this.CDO.inject),
                controllerAs: this.CDO.ng1Name,
                scope: false,
                compile: this.compile(this.CDO.ng1Name, this.CDO.annotations, this.CDO.autoNamespace),
                templateUrl: this.CDO.templateUrl,
                transclude: !this.CDO.isDecorator
            };
            return function () {
                return DDO;
            };
        };
        return ComponentLegacy;
    })(NgSham.AbstractComponentOneX);
    NgSham.ComponentLegacy = ComponentLegacy;
})(NgSham || (NgSham = {}));

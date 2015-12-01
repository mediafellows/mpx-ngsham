namespace NgSham {
  export class ComponentLegacy extends AbstractComponentOneX {
    protected DDO () {

      var DDO = {
        restrict:     this.CDO.restrict,
        controller:   this.inject(this.CDO.class, this.CDO.inject),
        controllerAs: this.CDO.ng1Name,
        scope:        false,
        compile:      this.compile(this.CDO.ng1Name, this.CDO.annotations, this.CDO.autoNamespace),
        templateUrl:  this.CDO.templateUrl,
        transclude:   !this.CDO.isDecorator
      };

      return function () {
        return DDO;
      }
    }
  }
}

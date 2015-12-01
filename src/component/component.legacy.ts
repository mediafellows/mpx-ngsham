namespace NgSham {
  export class ComponentLegacy extends AbstractComponentOneX {
    protected DDO (CDO) {
      var DDO = {
        restrict:     CDO.restrict,
        controller:   this.inject(CDO.class, CDO.inject),
        controllerAs: CDO.ng1Name,
        scope:        false,
        compile:      this.compile(CDO.ng1Name, CDO.annotations, CDO.autoNamespace),
        templateUrl:  CDO.templateUrl,
        transclude:   !CDO.isDecorator
      };

      return function () {
        return DDO;
      }
    }
  }
}

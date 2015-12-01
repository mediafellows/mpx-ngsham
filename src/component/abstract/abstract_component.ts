namespace NgSham {
  export abstract class AbstractComponent {

    protected config: ShamConfigObject;

    protected name: string;

    protected CDO: ShamCDO;

    constructor (config: ShamConfigObject) {
      this.config = config;
    }

    public component (name: string, userlandCDOorClass: any) {
      this.CDO = typeof userlandCDOorClass === 'function'
        ? this.cdoFromFunction(userlandCDOorClass)
        : this.cdoFromUserlandCDO(userlandCDOorClass);

      this.CDO.class = NgSham.ann.deAnnotate(this.CDO.class);

      this.createComponent();
    }

    protected cdoFromFunction (fn: Function): ShamCDO {
      return this.cdoFromUserlandCDO({class: fn});
    }

    protected cdoFromUserlandCDO (userlandCDO): ShamCDO {
      var CDO: ShamCDO = {
        selector:       userlandCDO.selector        || '',
        ng1Name:        userlandCDO.ng1Name         || '',
        restrict:       userlandCDO.restrict        || '',
        templateUrl:    userlandCDO.templateUrl     || false,
        properties:     userlandCDO.properties      || [],
        events:         userlandCDO.events          || [],
        host:           userlandCDO.host            || [],
        class:          userlandCDO.class           || function () {},
        inject:         userlandCDO.inject          || [],
        annotations: {
          properties:   userlandCDO.properties      || [],
          events:       userlandCDO.events          || [],
          host:         userlandCDO.host            || []
        },
        autoNamespace:  userlandCDO.autoNamespace   || false,
        isDecorator:    userlandCDO.isDecorator     || true
      }
      return CDO;
    }

    protected abstract createComponent (): void;

  }
}

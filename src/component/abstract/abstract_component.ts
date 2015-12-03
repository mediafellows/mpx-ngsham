module NgSham {

  export abstract class AbstractComponent {

    protected config: ShamConfigObject;
    protected name: string;
    protected CDO: ShamCDO;

    constructor (config: ShamConfigObject) {
      this.config = config;
    }

    public component (name: string, CDOorFn: any) {
      this.name = name;
      this.CDO = typeof CDOorFn === 'function'
        ? NgSham.util.coerceToShamCDO({class: CDOorFn})
        : NgSham.util.coerceToShamCDO(CDOorFn);
      this.createComponent();
    }

    public bootstrap (controller) {
      var CDO: ShamCDO = NgSham.reflect.deAnnotate(controller);
      this.component(CDO.selector, CDO);
    }

    protected abstract createComponent (): void;
  }
}

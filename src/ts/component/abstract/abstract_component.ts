namespace NgSham {
  abstract class AbstractComponent {

    protected config: ShamConfigObject;

    protected CDO: ShamCDO;

    constructor () {
      this.config = NgSham.getConfig();
      if (this.hasAnnotations())
        this.component(CDO.selector, _.extend(CDO, {class: original}));
    }

    public abstract component (name: string, userlandCDO: any);

  }
}

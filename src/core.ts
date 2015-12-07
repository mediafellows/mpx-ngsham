module NgSham {

  export class NgShamFactory {

    private static _instance: NgShamFactory = new NgShamFactory();
    protected config: ShamConfigObject;
    public componentCreator: ComponentCreator;
    public componentBootstrapper: Function;

    constructor () {
      if (NgShamFactory._instance) throw new Error('Singleton!');
      NgShamFactory._instance = this;
    }

    public static getInstance (): NgShamFactory {
      return NgShamFactory._instance;
    }

    public configure (config: ShamConfigObject): void {
      this.config = config;
      this.componentCreator = new NgSham[
        typeof this.config.forceUseComponentCreator === 'string'
        ? this.config.forceUseComponentCreator
        : this.version()
      ](this.config);
    }

    public shim (config: ShamConfigObject) {
      this.configure(config);
      return this.componentCreator.component;
    }

    public shimb (controller) {
      this.componentCreator.bootstrap(controller);
    }

    public fact () {
      return this.componentCreator.fact;
    }

    private version (): string {
           if (!this.config.angularVersion && window.angular) this.config.angularVersion = window.angular.version;
           if (this.config.angularVersion >  1.5) return 'ComponentTwoAlpha'
      else if (this.config.angularVersion == 1.5) return 'ComponentOneFive'
      else if (this.config.angularVersion >= 1.4) return 'ComponentOneFour'
      else if (this.config.angularVersion >= 1.3) return 'ComponentOneThree'
      else
        throw new Error('Angular versions less than 1.3 are not supported.');
    }
  }
}

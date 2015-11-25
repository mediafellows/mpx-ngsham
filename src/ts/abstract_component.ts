/// <reference path="./util.ts"/>

abstract class AbstractComponent {

  protected appName;
  protected componentsDir;

  constructor (appName, componentsDir) {
    this.appName       = appName;
    this.componentsDir = componentsDir;
  }
}

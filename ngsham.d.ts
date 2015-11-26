declare var _: any;
declare var angular: any;
declare var NgShamFactory: any;

/**
 * HACK: Or??
 */
interface ComponentCreators {
  component: Function;
}

/**
 * HACK: Please replace this with some more-or-less official spec!
 */
interface jQLiteElement {

}

/**
 * HACK: Please replace this with some more-or-less official spec!
 */
interface jQueryElement {

}

/**
 * A POJA that can be checked against Ng1's injector??
 */
interface Ng1InjectionParams {

}

/**
 * A POJO that describes the decorations of a Typescript class, even if null.
 */
interface TypeScriptDecorationsESxObject {
  // TODO: Will be quite tricky...
}

/**
 * Support for pre-System/ Webpack projects.
 */
interface Window {
  ngsham: any;
  ngshim: any;
  ngshambles: any;
  angular: any;
}

/**
 * "Component Definition Object"
 * Version-agnostic DDO (Directive Definition Object).
 */
interface ShamCDO {
  ng1Name: string;
  restrict: string;
  templateUrl: string|boolean;
  properties: Array<string>;
  events: Array<string>;
  host: Array<string>;
  class: Function;
  inject: Array<string>;
  annotations: ShamAnnotationsObject;
  autoNamespace: Boolean;
  isDecorator: Boolean;
}

/**
 * Sham backports @Component annotations, just like Angular 2's ES5 API.
 */
interface ShamAnnotationsObject {
  properties: Array<string>;
  events: Array<string>;
  host: Array<string>;
}

/**
 * Expected when using floral (Typescript Ng2) syntax.
 */
interface Ng2CDO {
  selector: string
}

/**
 * How Sham's config is passed around.
 */
interface ShamConfigObject {
  appName: string;
  angularVersion: number;
  componentsDir: string;
  forceUseComponentCreator: any;
}

declare var _: lodash;
declare var esprima: esprima;
declare var angular: Angular1_3|Angular1_4|Angular1_5|Angular2Alpha|Angular2;

/**
 * HACK: Please replace this with some more-or-less official spec!
 */
interface lodash {
  each: Function;
  empty: Function;
}

/**
 * HACK: Or is it??
 */
interface esprima {
  // Needed in case DIY reflection proves cumbersome.
}

/**
 * HACK: Or is it??
 */
interface Angular1_3 {
  forEach: Function;
  directive: Function;
}

/**
 * HACK: Or is it??
 */
interface Angular1_4 extends Angular1_3 {

}

/**
 * HACK: Or is it??
 */
interface Angular1_5 extends Angular1_4  {

}

/**
 * HACK: Or is it??
 */
interface Angular2Alpha {
  forEach: Function;
}

/**
 * HACK: Or is it??
 */
interface Angular2 {
  forEach: Function;
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

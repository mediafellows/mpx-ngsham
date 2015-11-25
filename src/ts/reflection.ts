/// <reference path="./util.ts"/>

namespace reflection {
  // TODO: Do Typescript namespaces get CamelCase? ...or no?
  // TODO: Esprima is too heavy. Can we find a lightweight reflection library? ...or else DIY?

  /**
   * Stringify a function and return its params.
   * @param  {function}      fn
   * @return {Array<string>}
   */
  export function reflectParams (fn: Function): Array<string> {

  }

  /**
   * Take a decorated (Typescript) class and return its decorations.
   * @param  {Object} decoratedClass
   * @return {Object}
   */
  export function reflectDecor (decoratedClass: Function): TypeScriptDecorationsESxObject {

  }
}

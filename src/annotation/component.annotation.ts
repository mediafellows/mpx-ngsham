module NgSham {
  export function Component (CDO: Ng2CDO) {

    var component: ComponentCreators = NgSham.getComponentCreator();

    return (target: Object) => {
      var original = target;

      function construct(constructor, args) {
        var c: any = function () {
          return constructor.apply(this, args);
        }
        c.prototype = constructor.prototype;
        return new c();
      }

      var f: any = function (...args) {

        return construct(original, args);
      }

      f.prototype = original.prototype;

      return f;
    }
  }
}

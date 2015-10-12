# NgSham

NgSham provides a terse syntax for declaring WebComponent-style Angular Directives.

It can create such directives in Angular >=1.4 (and, hopefully soon, Angular 2).

NgSham uses no compilers, preprocessors or build tools. It is 99% sugar, and 1% healthy Regex.

## What does NgSham do?

1. Normalize css selector-driven component naming across Angular 1 and Angular 2.

1. Further normalize component vs. decorator directives to element and attribute selectors, respectively.

1. Further still, normalize custom DOM prefixes to the folder structure of a _package_ of components.

      For example, say you fire up NgSham (by calling `ngshim()`) like this: `ngshim('myComponentRoot')`

      Then from now on:

      `ngsham('pkg/component', myCtrlFn)` will register a component-based directive that can be instantiated in HTML with `<pkg-component></pkg-component>`. Its template file will reside in `myComponentRoot/pkg/component/component.html`, and it will transclude its content using `<content select="my-content">`.

      Likewise:

      `ngsham('pkg/[component]', myCtrlFn)` will register a decorator directive that can be instantiated in HTML with `<div pkg-component></div>`. It will have _no template file_, and it will _not transclude its content_, but Angular 2-style attributes in its innerHTML will still be converted.

1. Normalize templates across Ng1 and Ng2 by down-converting to Angular 1 equivalents during the compile/linking phase.

  NgSham currently handles the following conversions:

        (custom-event) >>>> ctrl['customEvent'] = function () { scope.$eval(attr-value) }

        [custom-prop] >>>> scope.$watch function { return ctrl['customProp'] }

        static-attr >>>> ctrl.staticAttr = attrs['static-attr']

        *ng-for="item of items" >>>> ng-repeat="items in crtlAs.items"

        <content select="foo"> >>>> <div transclude-id="foo">

1. Auto-prefix these converted attributes with the `controllerAs` namespace in which they reside.

  Ex:

        (custom-event)="onChange()" >>>> (custom-event)="myCtrl.onChange()"

1. Sham change detection by providing a controller `this.onChange()` method, if it exists.

1. Sham the 'activate' function by calling it, if it exists. (Either `this.activate` or `this.___`)

      Ex (in CoffeeScript):

          ngsham 'ui/slider', '[foo]', '(bar)',
            ($element) ->
              @___ ->
                @element = $element[0]
                console.log @element

1. Dynamic properties also work on $scope-dependent children

    Ex:

        <div dumb-old-jquery-carousel-wrapper [images]="fetchImages()"></div>

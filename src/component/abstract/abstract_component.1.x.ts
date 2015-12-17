module NgSham {
  export abstract class AbstractComponentOneX extends AbstractComponent {

    // TODO: Split this class into: AbstractAnyComponent, AbstractShambolicComponent, AbstractShamComponent

    /**
     * Stringify a function and return its params as Ng1Injector.
     * @param  {function}      fn
     * @return {Array<string>}
     */
    protected reflectParams (fn: Function): Ng1InjectionParams {

    }

    /**
     * Placeholder for various strategies to generate Ng1 DDO's.
     * @param  {Object}   options
     * @return {Function}
     */
    protected abstract DDO (options: ShamCDO): Function;

    /**
     * Shambolic hack to support minifiers (for legacy Sham components).
     * @param  {Function}      fn
     * @param  {Array<string>} deps
     * @return {[type]}
     */
    protected inject (fn: Function, deps: Array<string>): Function {
      fn['$inject'] = deps;
      return fn;
    }

    /**
     * Parse Ng2 templates during compile phase, save the "hot attributes" for later auto-activation.
     * @param  {string}                ng1Name
     * @param  {ShamAnnotationsObject} annotations
     * @param  {Boolean}               autoNamespace
     * @return {Function}
     */
    protected compile (ng1Name: string, annotations: ShamAnnotationsObject, autoNamespace: boolean): Function {
      return (tElement: jQLiteElement|jQueryElement) => { // TODO: Use the real jQ types here!!!

        var

        attrs = tElement[0].attributes,

        cachedAttributes = {
          boundProperties: {},
          boundEvents: {},
          staticAttrs: {}
        };

        _.each(attrs, (a, i) => {
          var
          name = attrs[i].name,
          value = attrs[i].value;

          if (name && !NgSham.util.isNg2Attr(name) && name != ng1Name) {
            cachedAttributes.staticAttrs[name] = value;
          } else {
            if (name && NgSham.util.isNg2P(name)) {
              cachedAttributes.boundProperties[util.dash2Camel(name.replace(/^bind-|[\[\]]/g, ''))] = value;
            }
            if (name && NgSham.util.isNg2E(name)) {
              cachedAttributes.boundEvents[name.replace(/^on-/, '')] = value
            }
          }
        });

        tElement[0].innerHTML = this.convertTemplate(tElement[0].innerHTML, ng1Name, autoNamespace);
        return this.linkFn(annotations, cachedAttributes, ng1Name);
      }
    }

    /**
     * Do the actual string manipulation...
     * @param  {string}  templateString
     * @param  {string}  controllerAs
     * @param  {boolean} autoNamespace
     * @return {string}
     */
    protected convertTemplate (templateString: string, controllerAs: string, autoNamespace: boolean): string|boolean {

      // TODO: Should be abstract for ngshambles!!
      // New Sham should not require ___ in templates. See https://github.com/hannahhoward/a1atscript...

      if (!templateString || !controllerAs) return null

      var
      replaceAttrKnown        = '$1=\"$2' + controllerAs + '.$3',
      replaceAttrCustom       = '$1$2$3=\"$4' + controllerAs + '.$5',
      replaceInterpolation    = '$1' + controllerAs + '.$2',
      replaceNgFor            = 'ng-repeat=\"$3 in ' + controllerAs + '.$5',
      templateString          = templateString.replace(/ng-bind-html/g, 'savebindhtml'),
      templateString          = templateString.replace(/bind-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, '[$1]="$2"'),

      templateString          = templateString.replace(/on-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, "($1)=\"$2\"");
      templateString          = templateString.replace(/\((click)\)/g, 'ng-click');
      templateString          = templateString.replace(/(hidden)="/g, 'ng-hide="');
      templateString          = templateString.replace(/savebindhtml/g, 'ng-bind-html');

      if (autoNamespace) {
        templateString        = templateString.replace(/___/g, controllerAs + '.');
        templateString        = templateString.replace(/(ng-click|ng-if|ng-change|ng-hide)="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrKnown);
        templateString        = templateString.replace(/([\(\[])([a-zA-Z0-9-_]+)([\)\]])="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrCustom);
        templateString        = templateString.replace(/((\*ng-for="#)([a-zA-Z0-9-_]+)( of )([a-zA-Z0-9-_]+))/g, replaceNgFor);
      }

      templateString          = templateString.replace(/<content select="([a-zA-Z0-9-_]+)">(|.+)<\/content>/g, "<div transclude-id=\"$1\">$2</div>");

      return templateString;
    }

    /**
     * Polyfill Angular 2 during link phase.
     * @param  {ShamAnnotationsObject} annotations
     * @param  {Array<string>}         cachedAttributes
     * @param  {string}                name
     * @return {Function}
     */
    protected linkFn (annotations: ShamAnnotationsObject, cachedAttributes: any, name: string): Function { // TODO: Define interface for CachedAttributes...
      return function (scope, element, attrs, ctrl, transclude) {

        // Start activating the attrs cached over from compile phase;
        // "parentheticals" get controller methods.

        _.each(cachedAttributes.boundEvents, function (v,a) {
          (function (a,v) {
            ctrl[util.deParen(util.dash2Camel(a))] = function () {
              scope.$eval(v);
            }
          }(a,v));
        });

        // If some "host" events were given, make them work as expected.

        _.each(annotations.host, function (h) {
          if (attrs[annotations.host[h]]) {
            (function (h) {
              element.on(annotations.host[h], () => {
                ctrl[util.deParen(attrs[annotations.host[h]])]();
              });
            }(h));
        }});

        // Watch all the "bracketed" attributes.

        var
        watchedProperties = [],
        watchedExpressions = [];

        _.each(cachedAttributes.boundProperties, function (v,p) {
          watchedProperties.push(p);
          watchedExpressions.push(v);
        });

        _.each(cachedAttributes.staticAttrs, function (v,a) {
          ctrl[util.dash2Camel(a)] = v;
        });

        scope.$watchGroup(watchedExpressions, function (newVal, oldVal) {
          var changed = {};
          _.each(newVal, function (obj,index) {
            var
            source = watchedExpressions[index],
            prop   = watchedProperties[index];
            changed[prop] = obj;
            ctrl[prop] = obj;
          });
          if (typeof ctrl.onChange === 'function') ctrl.onChange(changed);
        });

        // Sham the "activate" function.

        if (typeof ctrl.activate === 'function')
          ctrl.activate();
        else if (typeof ctrl.___ === 'function')
          ctrl.___();

        // Support transclusion via <content>.

        if (typeof transclude === 'function') {
          transclude(function (clones) {
            angular.forEach(clones, function (clone) {
              if (clone.tagName) {
                var
                selector = clone.tagName,
                destination = element.find('[transclude-id="' + selector.toLowerCase() + '"]');
                if (destination.length) destination.append(clone);
                else clone.remove();
        }});});} // I need some ☕.
      };
    }

    /**
     * The basic Ng1 component strategy.
     * @param  {string} name
     * @param  {any}    userlandCDO
     * @return {[type]}
     */
    public createComponent (): void {

      var

      selectorParts = this.name.split('/'),
      selector      = selectorParts.pop(),
      nativeName    = util.deBracket(selector),
      prefix        = selectorParts.pop(),
      prefixedName  = prefix + '-' + nativeName;

      this.CDO.isDecorator = selector.indexOf('[') == 0,
      this.CDO.ng1Name     = util.dash2Camel(prefixedName);
      this.CDO.restrict    = this.CDO.isDecorator ? 'A' : 'E';
      this.CDO.annotations = {
        properties: ['title'],
        events:     ['change', 'close', 'save', 'destroy'],
        host:       ['click']
      };

      if (typeof this.CDO.templateUrl === 'string')
        util.noop();
      else if (this.CDO.isDecorator)
        this.CDO.templateUrl = null;
      else
        this.CDO.templateUrl = this.config.componentsDir + selectorParts.join('/') + prefix + '/' + nativeName + '/' + nativeName + '.html';

      _.each(this.CDO.properties, function (x) {
        this.CDO.annotations.properties.push(x); // TODO: Disallow duplicates!!!
      });

      _.each(this.CDO.events, function (x) {
        this.CDO.annotations.events.push(x); // TODO: Disallow duplicates!!!
      });

      _.each(this.CDO.host, function (x) {
        this.CDO.annotations.host.push(x); // TODO: Disallow duplicates!!!
      });

      if (this.config.verbose) console.log(this.CDO.ng1Name, this.CDO, this.DDO(this.CDO)());

      angular.module(this.config.appName).directive(this.CDO.ng1Name, this.DDO(this.CDO));
    }
  }
}

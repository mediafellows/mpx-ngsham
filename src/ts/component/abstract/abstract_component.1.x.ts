namespace NgSham {
  abstract class AbstractComponentOneX extends AbstractComponent {

    // TODO: Split this class into: AbstractAnyComponent, AbstractShambolicComponent, AbstractShamComponent

    /**
     * Stringify a function and return its params as Ng1Injector.
     * @param  {function}      fn
     * @return {Array<string>}
     */
    protected reflectParams (fn: Function): Ng1InjectionParams {

    }

    /**
     * Take a decorated Typescript class and returns a ShamCDO.
     * @param  {Object} decoratedClass
     * @return {Object}
     */
    protected reflectDecor (decoratedClass: Function): ShamCDO {

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

        _.each(attrs, (a) => {
          var
          name = attrs[a].name,
          value = attrs[a].value;

          if (!_.empty(name) && !util.isNg2Attr(name) && name != ng1Name) {
            cachedAttributes.staticAttrs[name] = value;
          } else {
            if (!_.empty(name) && util.isNg2P(name)) {
              cachedAttributes.boundProperties[util.dash2Camel(name.replace(/^bind-|[\[\]]/g, ''))] = value;
            }
            if (!_.empty(name) && util.isNg2E(name)) {
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

      if (_.empty(templateString) || _.empty(controllerAs)) return false

      var
      replaceAttrKnown        = "$1=\"$2#{controllerAs}.$3",
      replaceAttrCustom       = "$1$2$3=\"$4#{controllerAs}.$5",
      replaceInterpolation    = "$1#{controllerAs}.$2",
      replaceNgFor            = "ng-repeat=\"$3 in #{controllerAs}.$5",
      templateString          = templateString.replace(/bind-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, '[$1]="$2"'),

      templateString          = templateString.replace(/on-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, "($1)=\"$2\"");
      templateString          = templateString.replace(/\((click)\)/g, 'ng-click');
      templateString          = templateString.replace(/(hidden)="/g, 'ng-hide="');

      if (autoNamespace) {
        templateString        = templateString.replace(/___/g, "#{controllerAs}.");
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

        _.each(cachedAttributes.boundEvents, function (a,v) {
          (function (a,v) {
            ctrl[util.deParen(util.dash2Camel(a))] = function () {
              scope.$eval(v);
            }
          }(a,v));
        });

        // If some "host" events were given, make them work as expected.

        _.each(annotations.host, function (h) {
          if (!_.empty(attrs[annotations.host[h]])) {
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

        _.each(cachedAttributes.staticAttrs, function (a,v) {
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
              if (!_.empty(clone.tagName)) {
                var
                selector = clone.tagName,
                destination = element.find('[transclude-id="' + selector.toLowerCase() + '"]');
                if (destination.length) destination.append(clone);
                else clone.remove();
        }});});} // I need some ☕.
      };
    }

    /**
     * Sanitizes the userland CDO ("Component Definition Object").
     * @param  {any}               options
     * @return {ShamOptionsObject}
     */
    protected coerceOptions (userlandCDO: any): ShamCDO {
      var CDO = userlandCDO;
      CDO.ng1Name = '';
      CDO.restrict = '';
      CDO.templateUrl = '';
      CDO.properties = userlandCDO.properties || [];
      CDO.events = userlandCDO.events || [];
      CDO.host = userlandCDO.host || [];
      CDO.class = userlandCDO.class || function () {};
      CDO.inject = userlandCDO.inject || [];
      CDO.annotations = [];
      CDO.autoNamespace = userlandCDO.autoNamespace || true;
      CDO.isDecorator = false;
      return CDO;
    }

    /**
     * The basic Ng1 component strategy.
     * @param  {string} name
     * @param  {any}    userlandCDO
     * @return {[type]}
     */
    public component (name: string, userlandCDO: any) {

      var

      selectorParts = name.split('/'),
      selector      = selectorParts.pop(),
      isDecorator   = selector.indexOf('[') == 0,
      nativeName    = util.deBracket(selector),
      prefix        = selectorParts.pop(),
      prefixedName  = prefix + '-' + nativeName,
      CDO           = this.coerceOptions(userlandCDO);

      CDO.ng1Name     = util.dash2Camel(prefixedName);
      CDO.restrict    = isDecorator ? 'A' : 'E';
      CDO.annotations = {
        properties: [],
        events:     ['change', 'close', 'save', 'destroy'],
        host:       ['click']
      };

      if (CDO.templateUrl)
        util.noop();
      else if (isDecorator)
        CDO.templateUrl = null;
      else
        CDO.templateUrl = this.config.componentsDir + selectorParts.join('/') + prefix + '/' + nativeName + '/' + nativeName + '.html';

      _.each(CDO.properties, function (x) {
        CDO.annotations.properties.push(x); // TODO: Disallow duplicates!!!
      });

      _.each(CDO.events, function (x) {
        CDO.annotations.events.push(x); // TODO: Disallow duplicates!!!
      });

      _.each(CDO.host, function (x) {
        CDO.annotations.host.push(x); // TODO: Disallow duplicates!!!
      });

      angular.module(this.config.appName).directive(CDO.ng1Name, this.DDO(CDO));
    }
  }
}

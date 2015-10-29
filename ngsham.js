(function() {
  (function(window) {
    var angular1ComponentCreator;
    window.ngshim = function(appName, angularVersion, componentsDir) {
      var v;
      this.log = function(message, method) {
        method || (method = 'log');
        if (console && typeof console[method] === 'function') {
          return console[method](message);
        }
      };
      appName || (appName = 'app');
      angularVersion || (angularVersion = 1);
      componentsDir || (componentsDir = '/components/');
      v = function() {
        if (angularVersion === 1) {
          return window.ngsham = angular1ComponentCreator(appName, componentsDir);
        } else if (angularVersion === 2) {
          return window.ngsham = angular2ComponentCreator();
        }
      };
      return v();
    };
    angular1ComponentCreator = function(appName, componentsDir) {
      var inject;
      inject = function(fn, deps) {
        var args;
        args = [].concat(deps || []);
        args.push(fn);
        return args;
      };
      this.component = function(name, options) {
        var DDO, PEH, controllerFn, defaultEvents, defaultHostEvents, defaultProperties, e, isDecorator, nativeName, ng1Name, p, prefix, prefixedName, restrict, selector, selectorParts, templateUrl;
        PEH = {
          properties: [],
          events: [],
          hostEvents: []
        };
        defaultProperties = [];
        defaultEvents = ['change', 'close', 'save', 'destroy'];
        defaultHostEvents = ['click'];
        selectorParts = name.split('/');
        selector = selectorParts.pop();
        isDecorator = selector.indexOf('[') === 0;
        nativeName = this.deBracket(selector);
        prefix = selectorParts.pop();
        prefixedName = prefix + '-' + nativeName;
        ng1Name = this.dash2Camel(prefixedName);
        restrict = isDecorator ? 'A' : 'E';
        controllerFn = options["class"];
        if (isDecorator) {
          templateUrl = null;
        } else if (options.view != null) {
          templateUrl = componentsDir + prefix + '/' + options.view + '.html';
        } else {
          templateUrl = componentsDir + selectorParts.join('/') + prefix + '/' + nativeName + '/' + nativeName + '.html';
        }
        for (p in defaultProperties) {
          if (defaultProperties.hasOwnProperty(p)) {
            PEH.properties.push(defaultProperties[p]);
          }
        }
        for (p in options.properties) {
          if (options.properties.hasOwnProperty(p)) {
            PEH.properties.push(options.properties[p]);
          }
        }
        for (e in defaultEvents) {
          if (defaultEvents.hasOwnProperty(e)) {
            PEH.events.push(defaultEvents[e]);
          }
        }
        for (e in options.events) {
          if (options.events.hasOwnProperty(e)) {
            PEH.events.push(options.events[e]);
          }
        }
        for (e in defaultHostEvents) {
          if (defaultHostEvents.hasOwnProperty(e)) {
            PEH.hostEvents.push(defaultHostEvents[e]);
          }
        }
        for (e in options.host) {
          if (options.host.hasOwnProperty(e)) {
            PEH.hostEvents.push(options.host[e]);
          }
        }
        DDO = {
          restrict: restrict,
          controller: inject(controllerFn, options.inject),
          controllerAs: ng1Name,
          scope: false,
          compile: this.compileFn(ng1Name, PEH, options.autoNamespace),
          templateUrl: templateUrl,
          transclude: !isDecorator
        };
        return angular.module(appName).directive(ng1Name, function() {
          return DDO;
        });
      };
      this.convertTemplate = function(templateString, controllerAs, autoNamespace) {
        var replaceAttrCustom, replaceAttrKnown, replaceInterpolation, replaceNgFor;
        if (autoNamespace == null) {
          autoNamespace = true;
        }
        if (!(templateString && controllerAs)) {
          return null;
        }
        replaceAttrKnown = "$1=\"$2" + controllerAs + ".$3";
        replaceAttrCustom = "$1$2$3=\"$4" + controllerAs + ".$5";
        replaceInterpolation = "$1" + controllerAs + ".$2";
        replaceNgFor = "ng-repeat=\"$3 in " + controllerAs + ".$5";
        templateString = templateString.replace(/bind-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, '[$1]="$2"');
        templateString = templateString.replace(/on-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, "($1)=\"$2\"");
        templateString = templateString.replace(/\((click)\)/g, 'ng-click');
        templateString = templateString.replace(/(hidden)="/g, 'ng-hide="');
        if (autoNamespace) {
          templateString = templateString.replace(/___/g, controllerAs + ".");
          templateString = templateString.replace(/(ng-click|ng-if|ng-change|ng-hide)="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrKnown);
          templateString = templateString.replace(/([\(\[])([a-zA-Z0-9-_]+)([\)\]])="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrCustom);
          templateString = templateString.replace(/((\*ng-for="#)([a-zA-Z0-9-_]+)( of )([a-zA-Z0-9-_]+))/g, replaceNgFor);
        }
        templateString = templateString.replace(/<content select="([a-zA-Z0-9-_]+)">(|.+)<\/content>/g, "<div transclude-id=\"$1\">$2</div>");
        return templateString;
      };
      this.compileFn = function(ng1Name, PEH, autoNamespace) {
        return (function(_this) {
          return function(tElement) {
            var a, attrs, cachedAttributes, name, value;
            attrs = tElement[0].attributes;
            cachedAttributes = {
              boundProperties: {},
              boundEvents: {},
              staticAttrs: {}
            };
            for (a in attrs) {
              if (attrs.hasOwnProperty(a)) {
                name = attrs[a].name;
                value = attrs[a].value;
                if ((name != null) && !_this.isNg2Attr(name)) {
                  if (name !== ng1Name) {
                    cachedAttributes.staticAttrs[name] = value;
                  }
                } else {
                  if ((name != null) && _this.isNg2P(name)) {
                    cachedAttributes.boundProperties[_this.dash2Camel(name.replace(/^bind-|[\[\]]/g, ''))] = value;
                  }
                  if ((name != null) && _this.isNg2E(name)) {
                    cachedAttributes.boundEvents[name.replace(/^on-/, '')] = value;
                  }
                }
              }
            }
            tElement[0].innerHTML = _this.convertTemplate(tElement[0].innerHTML, ng1Name, autoNamespace);
            return _this.linkFn(PEH, cachedAttributes, ng1Name);
          };
        })(this);
      };
      this.linkFn = function(PEH, cachedAttributes, name) {
        return function(scope, element, attrs, ctrl, transclude) {
          var a, fn1, h, ref, ref1, v, watchedExpressions, watchedProperties;
          ref = cachedAttributes.boundEvents;
          fn1 = function(a, v) {
            return ctrl[this.deParen(this.dash2Camel(a))] = function() {
              return scope.$eval(v);
            };
          };
          for (a in ref) {
            v = ref[a];
            fn1(a, v);
          }
          for (h in PEH.hostEvents) {
            if (attrs[PEH.hostEvents[h]] != null) {
              (function(_this) {
                return (function(h) {
                  return element.on(PEH.hostEvents[h], function() {
                    return ctrl[_this.deParen(attrs[PEH.hostEvents[h]])]();
                  });
                });
              })(this)(h);
            }
          }
          watchedProperties = [];
          watchedExpressions = [];
          _.each(cachedAttributes.boundProperties, function(v, p) {
            watchedProperties.push(p);
            return watchedExpressions.push(v);
          });
          ref1 = cachedAttributes.staticAttrs;
          for (a in ref1) {
            v = ref1[a];
            if (attrs.hasOwnProperty(a)) {
              ctrl[this.dash2Camel(a)] = v;
            }
          }
          scope.$watchGroup(watchedExpressions, function(newVal, oldVal) {
            var changed, i, index, len, obj, prop, source;
            changed = {};
            for (index = i = 0, len = newVal.length; i < len; index = ++i) {
              obj = newVal[index];
              source = watchedExpressions[index];
              prop = watchedProperties[index];
              changed[prop] = obj;
              ctrl[prop] = obj;
            }
            return typeof ctrl.onChange === "function" ? ctrl.onChange(changed) : void 0;
          });
          if (typeof ctrl.activate === 'function') {
            ctrl.activate();
          } else if (typeof ctrl.___ === 'function') {
            ctrl.___();
          }
          if (typeof transclude === 'function') {
            return transclude(function(clones) {
              return angular.forEach(clones, function(clone) {
                var destination, selector;
                if (selector = clone.tagName) {
                  destination = element.find('[transclude-id="' + selector.toLowerCase() + '"]');
                  if (destination.length) {
                    return destination.append(clone);
                  } else {
                    return clone.remove();
                  }
                }
              });
            });
          }
        };
      };
      this.deParen = function(s) {
        return s.replace(/[\(\)]/g, '');
      };
      this.deBracket = function(s) {
        return s.replace(/[\[\]]/g, '');
      };
      this.dash2Camel = function(s) {
        return s.replace(/-([a-z])/g, function(g) {
          return g[1].toUpperCase();
        });
      };
      this.isNg2E = function(n) {
        return /(^\((.+)\)$)/.test(n) || n.indexOf('on-') === 0;
      };
      this.isNg2P = function(n) {
        return /(^\[(.+)\]$)/.test(n) || n.indexOf('bind-') === 0;
      };
      this.isNg2Attr = function(n) {
        return this.isNg2E(n) || this.isNg2P(n);
      };
      this.endsWith = function(e, s) {
        return s.indexOf(e, s.length - e.length) !== -1;
      };
      this.attrs2String = function(n, v) {
        return n + "=\"" + v + "\"";
      };
      this.component.ctrl = function(name, options) {
        return angular.module(appName).controller(name, inject(options["class"], options.inject));
      };
      this.component.fact = (function(_this) {
        return function(name, options) {
          return angular.module(appName).factory(name, inject(options["class"], options.inject));
        };
      })(this);
      return this.component;
    };
    return null;
  })(window);

}).call(this);

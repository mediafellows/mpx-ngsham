var NgSham;
(function (NgSham) {
    var NgShamFactory = (function () {
        function NgShamFactory() {
            if (NgShamFactory._instance)
                throw new Error('Singleton!');
            NgShamFactory._instance = this;
        }
        NgShamFactory.getInstance = function () {
            return NgShamFactory._instance;
        };
        NgShamFactory.prototype.configure = function (config) {
            this.config = config;
            this.componentCreator = new NgSham[typeof this.config.forceUseComponentCreator === 'string'
                ? this.config.forceUseComponentCreator
                : this.version()](this.config);
        };
        NgShamFactory.prototype.getComponentCreator = function () {
            if (!this.componentCreator)
                throw new Error('Run NgSham.configure() first!');
            return this.componentCreator;
        };
        NgShamFactory.prototype.shim = function (config) {
            this.configure(config);
            return this.componentCreator.component;
        };
        NgShamFactory.prototype.getConfig = function () {
            return this.config;
        };
        NgShamFactory.prototype.bootstrap = function (controller) {
            if (!this.hasComponentAnnotations(controller))
                return;
            var CDO = this.annotations2CDO(controller);
            this.componentCreator.component(CDO);
        };
        NgShamFactory.prototype.hasComponentAnnotations = function (controller) {
            return !!Reflect.getMetadataKeys(controller);
        };
        NgShamFactory.prototype.annotations2CDO = function (controller) {
            var keys = Reflect.getMetadataKeys(controller), CDO;
            _.each(keys, function () {
            });
            return CDO;
        };
        NgShamFactory.prototype.version = function () {
            if (!this.config.angularVersion && window.angular)
                this.config.angularVersion = window.angular.version;
            if (this.config.angularVersion > 1.5)
                return 'ComponentTwoAlpha';
            else if (this.config.angularVersion == 1.5)
                return 'ComponentOneFive';
            else if (this.config.angularVersion >= 1.4)
                return 'ComponentOneFour';
            else if (this.config.angularVersion >= 1.3)
                return 'ComponentOneThree';
            else
                throw new Error('Angular versions less than 1.3 are not supported.');
        };
        NgShamFactory._instance = new NgShamFactory();
        return NgShamFactory;
    })();
    NgSham.NgShamFactory = NgShamFactory;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var util;
    (function (util) {
        function noop() { }
        util.noop = noop;
        ;
        function deBracket(s) {
            return s.replace(/[\[\]]/g, '');
        }
        util.deBracket = deBracket;
        ;
        function dash2Camel(s) {
            return s.replace(/-([a-z])/g, function (g) {
                return g[1].toUpperCase();
            });
        }
        util.dash2Camel = dash2Camel;
        ;
        function isNg2E(s) {
            return /(^\((.+)\)$)/.test(s) || s.indexOf('on-') === 0;
        }
        util.isNg2E = isNg2E;
        ;
        function isNg2P(s) {
            return /(^\[(.+)\]$)/.test(s) || s.indexOf('bind-') === 0;
        }
        util.isNg2P = isNg2P;
        ;
        function isNg2Attr(s) {
            return isNg2E(s) || isNg2P(s);
        }
        util.isNg2Attr = isNg2Attr;
        ;
        function deParen(s) {
            return s.replace(/[\(\)]/g, '');
        }
        util.deParen = deParen;
        ;
    })(util = NgSham.util || (NgSham.util = {}));
})(NgSham || (NgSham = {}));
var reflection;
(function (reflection) {
    function reflectParams(fn) {
    }
    reflection.reflectParams = reflectParams;
    function reflectDecor(decoratedClass) {
    }
    reflection.reflectDecor = reflectDecor;
})(reflection || (reflection = {}));
var NgSham;
(function (NgSham) {
    function Component(CDO) {
        var component = NgSham.getComponentCreator();
        return function (target) {
            var original = target;
            function construct(constructor, args) {
                var c = function () {
                    return constructor.apply(this, args);
                };
                c.prototype = constructor.prototype;
                return new c();
            }
            var f = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return construct(original, args);
            };
            f.prototype = original.prototype;
            return f;
        };
    }
    NgSham.Component = Component;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var AbstractComponent = (function () {
        function AbstractComponent(config) {
            this.config = config;
        }
        AbstractComponent.prototype.component = function (name, userlandCDOorClass) {
            this.name = name;
            this.CDO = typeof userlandCDOorClass === 'function'
                ? this.cdoFromFunction(userlandCDOorClass)
                : this.cdoFromUserlandCDO(userlandCDOorClass);
            this.CDO.class = NgSham.ann.deAnnotate(this.CDO.class);
            this.createComponent();
        };
        AbstractComponent.prototype.cdoFromFunction = function (fn) {
            return this.cdoFromUserlandCDO({ class: fn });
        };
        AbstractComponent.prototype.cdoFromUserlandCDO = function (userlandCDO) {
            var CDO = {
                selector: userlandCDO.selector || '',
                ng1Name: userlandCDO.ng1Name || '',
                restrict: userlandCDO.restrict || '',
                templateUrl: userlandCDO.templateUrl || false,
                properties: userlandCDO.properties || [],
                events: userlandCDO.events || [],
                host: userlandCDO.host || [],
                class: userlandCDO.class || function () { },
                inject: userlandCDO.inject || [],
                annotations: {
                    properties: userlandCDO.properties || [],
                    events: userlandCDO.events || [],
                    host: userlandCDO.host || []
                },
                autoNamespace: userlandCDO.autoNamespace || false,
                isDecorator: userlandCDO.isDecorator || true
            };
            return CDO;
        };
        return AbstractComponent;
    })();
    NgSham.AbstractComponent = AbstractComponent;
})(NgSham || (NgSham = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NgSham;
(function (NgSham) {
    var AbstractComponentOneX = (function (_super) {
        __extends(AbstractComponentOneX, _super);
        function AbstractComponentOneX() {
            _super.apply(this, arguments);
        }
        AbstractComponentOneX.prototype.reflectParams = function (fn) {
        };
        AbstractComponentOneX.prototype.inject = function (fn, deps) {
            fn['$inject'] = deps;
            return fn;
        };
        AbstractComponentOneX.prototype.compile = function (ng1Name, annotations, autoNamespace) {
            var _this = this;
            return function (tElement) {
                var attrs = tElement[0].attributes, cachedAttributes = {
                    boundProperties: {},
                    boundEvents: {},
                    staticAttrs: {}
                };
                _.each(attrs, function (a) {
                    var name = attrs[a].name, value = attrs[a].value;
                    if (!_.empty(name) && !NgSham.util.isNg2Attr(name) && name != ng1Name) {
                        cachedAttributes.staticAttrs[name] = value;
                    }
                    else {
                        if (!_.empty(name) && NgSham.util.isNg2P(name)) {
                            cachedAttributes.boundProperties[NgSham.util.dash2Camel(name.replace(/^bind-|[\[\]]/g, ''))] = value;
                        }
                        if (!_.empty(name) && NgSham.util.isNg2E(name)) {
                            cachedAttributes.boundEvents[name.replace(/^on-/, '')] = value;
                        }
                    }
                });
                tElement[0].innerHTML = _this.convertTemplate(tElement[0].innerHTML, ng1Name, autoNamespace);
                return _this.linkFn(annotations, cachedAttributes, ng1Name);
            };
        };
        AbstractComponentOneX.prototype.convertTemplate = function (templateString, controllerAs, autoNamespace) {
            if (_.empty(templateString) || _.empty(controllerAs))
                return false;
            var replaceAttrKnown = "$1=\"$2#{controllerAs}.$3", replaceAttrCustom = "$1$2$3=\"$4#{controllerAs}.$5", replaceInterpolation = "$1#{controllerAs}.$2", replaceNgFor = "ng-repeat=\"$3 in #{controllerAs}.$5", templateString = templateString.replace(/bind-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, '[$1]="$2"'), templateString = templateString.replace(/on-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, "($1)=\"$2\"");
            templateString = templateString.replace(/\((click)\)/g, 'ng-click');
            templateString = templateString.replace(/(hidden)="/g, 'ng-hide="');
            if (autoNamespace) {
                templateString = templateString.replace(/___/g, "#{controllerAs}.");
                templateString = templateString.replace(/(ng-click|ng-if|ng-change|ng-hide)="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrKnown);
                templateString = templateString.replace(/([\(\[])([a-zA-Z0-9-_]+)([\)\]])="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrCustom);
                templateString = templateString.replace(/((\*ng-for="#)([a-zA-Z0-9-_]+)( of )([a-zA-Z0-9-_]+))/g, replaceNgFor);
            }
            templateString = templateString.replace(/<content select="([a-zA-Z0-9-_]+)">(|.+)<\/content>/g, "<div transclude-id=\"$1\">$2</div>");
            return templateString;
        };
        AbstractComponentOneX.prototype.linkFn = function (annotations, cachedAttributes, name) {
            return function (scope, element, attrs, ctrl, transclude) {
                _.each(cachedAttributes.boundEvents, function (a, v) {
                    (function (a, v) {
                        ctrl[NgSham.util.deParen(NgSham.util.dash2Camel(a))] = function () {
                            scope.$eval(v);
                        };
                    }(a, v));
                });
                _.each(annotations.host, function (h) {
                    if (!_.empty(attrs[annotations.host[h]])) {
                        (function (h) {
                            element.on(annotations.host[h], function () {
                                ctrl[NgSham.util.deParen(attrs[annotations.host[h]])]();
                            });
                        }(h));
                    }
                });
                var watchedProperties = [], watchedExpressions = [];
                _.each(cachedAttributes.boundProperties, function (v, p) {
                    watchedProperties.push(p);
                    watchedExpressions.push(v);
                });
                _.each(cachedAttributes.staticAttrs, function (a, v) {
                    ctrl[NgSham.util.dash2Camel(a)] = v;
                });
                scope.$watchGroup(watchedExpressions, function (newVal, oldVal) {
                    var changed = {};
                    _.each(newVal, function (obj, index) {
                        var source = watchedExpressions[index], prop = watchedProperties[index];
                        changed[prop] = obj;
                        ctrl[prop] = obj;
                    });
                    if (typeof ctrl.onChange === 'function')
                        ctrl.onChange(changed);
                });
                if (typeof ctrl.activate === 'function')
                    ctrl.activate();
                else if (typeof ctrl.___ === 'function')
                    ctrl.___();
                if (typeof transclude === 'function') {
                    transclude(function (clones) {
                        angular.forEach(clones, function (clone) {
                            if (!_.empty(clone.tagName)) {
                                var selector = clone.tagName, destination = element.find('[transclude-id="' + selector.toLowerCase() + '"]');
                                if (destination.length)
                                    destination.append(clone);
                                else
                                    clone.remove();
                            }
                        });
                    });
                }
            };
        };
        AbstractComponentOneX.prototype.createComponent = function () {
            var selectorParts = this.name.split('/'), selector = selectorParts.pop(), isDecorator = selector.indexOf('[') == 0, nativeName = NgSham.util.deBracket(selector), prefix = selectorParts.pop(), prefixedName = prefix + '-' + nativeName;
            this.CDO.ng1Name = NgSham.util.dash2Camel(prefixedName);
            this.CDO.restrict = isDecorator ? 'A' : 'E';
            this.CDO.annotations = {
                properties: [],
                events: ['change', 'close', 'save', 'destroy'],
                host: ['click']
            };
            if (this.CDO.templateUrl)
                NgSham.util.noop();
            else if (isDecorator)
                this.CDO.templateUrl = null;
            else
                this.CDO.templateUrl = this.config.componentsDir + selectorParts.join('/') + prefix + '/' + nativeName + '/' + nativeName + '.html';
            _.each(this.CDO.properties, function (x) {
                this.CDO.annotations.properties.push(x);
            });
            _.each(this.CDO.events, function (x) {
                this.CDO.annotations.events.push(x);
            });
            _.each(this.CDO.host, function (x) {
                this.CDO.annotations.host.push(x);
            });
            console.log(this.CDO.ng1Name);
            angular.module(this.config.appName, []).directive(this.CDO.ng1Name, this.DDO(this.CDO));
        };
        return AbstractComponentOneX;
    })(NgSham.AbstractComponent);
    NgSham.AbstractComponentOneX = AbstractComponentOneX;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var ComponentOneThree = (function (_super) {
        __extends(ComponentOneThree, _super);
        function ComponentOneThree() {
            _super.apply(this, arguments);
        }
        return ComponentOneThree;
    })(NgSham.AbstractComponentOneX);
    NgSham.ComponentOneThree = ComponentOneThree;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var ComponentOneFour = (function (_super) {
        __extends(ComponentOneFour, _super);
        function ComponentOneFour() {
            _super.apply(this, arguments);
        }
        return ComponentOneFour;
    })(NgSham.AbstractComponentOneX);
    NgSham.ComponentOneFour = ComponentOneFour;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var ComponentOneFive = (function (_super) {
        __extends(ComponentOneFive, _super);
        function ComponentOneFive() {
            _super.apply(this, arguments);
        }
        return ComponentOneFive;
    })(NgSham.AbstractComponentOneX);
    NgSham.ComponentOneFive = ComponentOneFive;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var ComponentTwoAlpha = (function (_super) {
        __extends(ComponentTwoAlpha, _super);
        function ComponentTwoAlpha() {
            _super.apply(this, arguments);
        }
        return ComponentTwoAlpha;
    })(NgSham.AbstractComponent);
    NgSham.ComponentTwoAlpha = ComponentTwoAlpha;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var ComponentLegacy = (function (_super) {
        __extends(ComponentLegacy, _super);
        function ComponentLegacy() {
            _super.apply(this, arguments);
        }
        ComponentLegacy.prototype.DDO = function () {
            var DDO = {
                restrict: this.CDO.restrict,
                controller: this.inject(this.CDO.class, this.CDO.inject),
                controllerAs: this.CDO.ng1Name,
                scope: false,
                compile: this.compile(this.CDO.ng1Name, this.CDO.annotations, this.CDO.autoNamespace),
                templateUrl: this.CDO.templateUrl,
                transclude: !this.CDO.isDecorator
            };
            return function () {
                return DDO;
            };
        };
        return ComponentLegacy;
    })(NgSham.AbstractComponentOneX);
    NgSham.ComponentLegacy = ComponentLegacy;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var SUPPORT_JAVASCRIPT = true;
    NgSham.IS_A_CLOSURE = true;
    if (SUPPORT_JAVASCRIPT) {
        window.ngshim = function (appName, angularVersion, componentsDir) {
            var sham = NgSham.NgShamFactory.getInstance();
            window.ngsham = sham.shim({
                appName: appName,
                angularVersion: angularVersion,
                componentsDir: componentsDir,
                forceUseComponentCreator: false
            }).bind(sham.componentCreator);
            window.ngshambles = sham.shim({
                appName: appName,
                angularVersion: angularVersion,
                componentsDir: componentsDir,
                forceUseComponentCreator: 'ComponentLegacy'
            }).bind(sham.componentCreator);
        };
    }
    function bootstrap(controller) {
        if (this.IS_A_CLOSURE)
            throw new Error('It is forbidden to call bootstrap from Javascript.');
        NgSham.NgShamFactory.getInstance.annotations2CDO(controller);
    }
    NgSham.bootstrap = bootstrap;
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var ann;
    (function (ann) {
        function deAnnotate(fn) {
            return fn;
        }
        ann.deAnnotate = deAnnotate;
    })(ann = NgSham.ann || (NgSham.ann = {}));
})(NgSham || (NgSham = {}));
//# sourceMappingURL=ngsham.js.map
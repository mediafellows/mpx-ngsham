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
        NgShamFactory.prototype.shim = function (config) {
            this.configure(config);
            return this.componentCreator.component;
        };
        NgShamFactory.prototype.shimb = function (controller) {
            this.componentCreator.bootstrap(controller);
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
    var decorators;
    (function (decorators) {
        function Component(partialCDO) {
            return function (target) {
                if (partialCDO.selector)
                    target.prototype.selector = partialCDO.selector;
                if (partialCDO.properties)
                    target.prototype.properties = partialCDO.properties;
                if (partialCDO.templateUrl)
                    target.prototype.properties = partialCDO.templateUrl;
                if (partialCDO.events)
                    target.prototype.events = partialCDO.events;
                if (partialCDO.host)
                    target.prototype.host = partialCDO.host;
                return target;
            };
        }
        decorators.Component = Component;
    })(decorators = NgSham.decorators || (NgSham.decorators = {}));
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
        function coerceToShamCDO(sth) {
            var CDO = {
                selector: sth.selector || '',
                ng1Name: sth.ng1Name || '',
                restrict: sth.restrict || '',
                templateUrl: sth.templateUrl || false,
                properties: sth.properties || [],
                events: sth.events || [],
                host: sth.host || [],
                class: sth.class || function () { },
                inject: sth.inject || [],
                annotations: {
                    properties: sth.properties || [],
                    events: sth.events || [],
                    host: sth.host || []
                },
                autoNamespace: sth.autoNamespace === false ? false : true,
                isDecorator: sth.isDecorator || true
            };
            return CDO;
        }
        util.coerceToShamCDO = coerceToShamCDO;
    })(util = NgSham.util || (NgSham.util = {}));
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var reflect;
    (function (reflect) {
        function deAnnotate(c) {
            var i = new c(), CDO = {
                selector: c.prototype.selector || '',
                ng1Name: c.prototype.ng1Name || '',
                restrict: c.prototype.restrict || '',
                templateUrl: c.prototype.templateUrl || false,
                properties: c.prototype.properties || [],
                events: c.prototype.events || [],
                host: c.prototype.host || [],
                class: c,
                inject: c.prototype.inject || [],
                annotations: c.prototype.annotations || {},
                autoNamespace: c.prototype.autoNamespace || true,
                isDecorator: c.prototype.isDecorator || true,
            };
            return CDO;
        }
        reflect.deAnnotate = deAnnotate;
    })(reflect = NgSham.reflect || (NgSham.reflect = {}));
})(NgSham || (NgSham = {}));
var NgSham;
(function (NgSham) {
    var AbstractComponent = (function () {
        function AbstractComponent(config) {
            this.config = config;
        }
        AbstractComponent.prototype.component = function (name, CDOorFn) {
            this.name = name;
            this.CDO = typeof CDOorFn === 'function'
                ? NgSham.util.coerceToShamCDO({ selector: name, class: CDOorFn })
                : NgSham.util.coerceToShamCDO(CDOorFn);
            this.createComponent();
        };
        AbstractComponent.prototype.bootstrap = function (controller) {
            var CDO = NgSham.reflect.deAnnotate(controller);
            this.component(CDO.selector, CDO);
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
                _.each(attrs, function (a, i) {
                    var name = attrs[i].name, value = attrs[i].value;
                    if (name && !NgSham.util.isNg2Attr(name) && name != ng1Name) {
                        cachedAttributes.staticAttrs[name] = value;
                    }
                    else {
                        if (name && NgSham.util.isNg2P(name)) {
                            cachedAttributes.boundProperties[NgSham.util.dash2Camel(name.replace(/^bind-|[\[\]]/g, ''))] = value;
                        }
                        if (name && NgSham.util.isNg2E(name)) {
                            cachedAttributes.boundEvents[name.replace(/^on-/, '')] = value;
                        }
                    }
                });
                tElement[0].innerHTML = _this.convertTemplate(tElement[0].innerHTML, ng1Name, autoNamespace);
                return _this.linkFn(annotations, cachedAttributes, ng1Name);
            };
        };
        AbstractComponentOneX.prototype.convertTemplate = function (templateString, controllerAs, autoNamespace) {
            if (!templateString || !controllerAs)
                return null;
            var replaceAttrKnown = '$1=\"$2' + controllerAs + '.$3', replaceAttrCustom = '$1$2$3=\"$4' + controllerAs + '.$5', replaceInterpolation = '$1' + controllerAs + '.$2', replaceNgFor = 'ng-repeat=\"$3 in ' + controllerAs + '.$5', templateString = templateString.replace(/ng-bind-html/g, 'savebindhtml'), templateString = templateString.replace(/bind-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, '[$1]="$2"'), templateString = templateString.replace(/on-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, "($1)=\"$2\"");
            templateString = templateString.replace(/\((click)\)/g, 'ng-click');
            templateString = templateString.replace(/(hidden)="/g, 'ng-hide="');
            templateString = templateString.replace(/savebindhtml/g, 'ng-bind-html');
            if (autoNamespace) {
                templateString = templateString.replace(/___/g, controllerAs + '.');
                templateString = templateString.replace(/(ng-click|ng-if|ng-change|ng-hide)="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrKnown);
                templateString = templateString.replace(/([\(\[])([a-zA-Z0-9-_]+)([\)\]])="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrCustom);
                templateString = templateString.replace(/((\*ng-for="#)([a-zA-Z0-9-_]+)( of )([a-zA-Z0-9-_]+))/g, replaceNgFor);
            }
            templateString = templateString.replace(/<content select="([a-zA-Z0-9-_]+)">(|.+)<\/content>/g, "<div transclude-id=\"$1\">$2</div>");
            return templateString;
        };
        AbstractComponentOneX.prototype.linkFn = function (annotations, cachedAttributes, name) {
            return function (scope, element, attrs, ctrl, transclude) {
                _.each(cachedAttributes.boundEvents, function (v, a) {
                    (function (a, v) {
                        ctrl[NgSham.util.deParen(NgSham.util.dash2Camel(a))] = function () {
                            scope.$eval(v);
                        };
                    }(a, v));
                });
                _.each(annotations.host, function (h) {
                    if (attrs[annotations.host[h]]) {
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
                _.each(cachedAttributes.staticAttrs, function (v, a) {
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
                            if (clone.tagName) {
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
            var selectorParts = this.name.split('/'), selector = selectorParts.pop(), nativeName = NgSham.util.deBracket(selector), prefix = selectorParts.pop(), prefixedName = prefix + '-' + nativeName;
            this.CDO.isDecorator = selector.indexOf('[') == 0,
                this.CDO.ng1Name = NgSham.util.dash2Camel(prefixedName);
            this.CDO.restrict = this.CDO.isDecorator ? 'A' : 'E';
            this.CDO.annotations = {
                properties: ['title'],
                events: ['change', 'close', 'save', 'destroy'],
                host: ['click']
            };
            if (typeof this.CDO.templateUrl === 'string')
                NgSham.util.noop();
            else if (this.CDO.isDecorator)
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
            if (this.config.verbose)
                console.log(this.CDO.ng1Name, this.CDO, this.DDO(this.CDO)());
            angular.module(this.config.appName).directive(this.CDO.ng1Name, this.DDO(this.CDO));
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
    window.ngshim = function (appName, angularVersion, componentsDir, verbose) {
        if (verbose === void 0) { verbose = false; }
        var sham = NgSham.NgShamFactory.getInstance();
        window.ngsham = sham.shim({
            appName: appName,
            angularVersion: angularVersion,
            componentsDir: componentsDir,
            forceUseComponentCreator: false,
            verbose: verbose
        }).bind(sham.componentCreator);
        window.ngshambles = sham.shim({
            appName: appName,
            angularVersion: angularVersion,
            componentsDir: componentsDir,
            forceUseComponentCreator: 'ComponentLegacy',
            verbose: verbose
        }).bind(sham.componentCreator);
        window.bootstrap = function (controller) {
            sham.shimb(controller);
        }.bind(sham.componentCreator);
    };
})(NgSham || (NgSham = {}));

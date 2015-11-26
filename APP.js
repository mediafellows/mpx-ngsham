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
})(util || (util = {}));
/// <reference path="../../util.ts"/>
/// <reference path="../../ngsham.ts"/>
var AbstractComponent = (function () {
    function AbstractComponent() {
        this.config = NgSham.getConfig();
        if (this.hasAnnotations())
            this.component(CDO.selector, _.extend(CDO, { class: original }));
    }
    return AbstractComponent;
})();
/// <reference path="./util.ts"/>
var reflection;
(function (reflection) {
    function reflectParams(fn) {
    }
    reflection.reflectParams = reflectParams;
    function reflectDecor(decoratedClass) {
    }
    reflection.reflectDecor = reflectDecor;
})(reflection || (reflection = {}));
/// <reference path="../../util.ts"/>
/// <reference path="../../reflection.ts"/>
/// <reference path="./abstract_component.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponentOneX = (function (_super) {
    __extends(AbstractComponentOneX, _super);
    function AbstractComponentOneX() {
        _super.apply(this, arguments);
    }
    AbstractComponentOneX.prototype.reflectParams = function (fn) {
    };
    AbstractComponentOneX.prototype.reflectDecor = function (decoratedClass) {
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
                if (!_.empty(name) && !util.isNg2Attr(name) && name != ng1Name) {
                    cachedAttributes.staticAttrs[name] = value;
                }
                else {
                    if (!_.empty(name) && util.isNg2P(name)) {
                        cachedAttributes.boundProperties[util.dash2Camel(name.replace(/^bind-|[\[\]]/g, ''))] = value;
                    }
                    if (!_.empty(name) && util.isNg2E(name)) {
                        cachedAttributes.boundEvents[name.replace(/^on-/, '')] = value;
                    }
                }
            });
            tElement[0].innerHTML = _this.convertTemplate(tElement[0].innerHTML, ng1Name, autoNamespace);
            return _this.linkFn(annotations, cachedAttributes, ng1Name);
        };
    };
    AbstractComponentOneX.prototype.convertTemplate = function (templateString, controllerAs, autoNamespace) {
        // TODO: Should be abstract for ngshambles!!
        // New Sham should not require ___ in templates. See https://github.com/hannahhoward/a1atscript...
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
            // Start activating the attrs cached over from compile phase;
            // "parentheticals" get controller methods.
            _.each(cachedAttributes.boundEvents, function (a, v) {
                (function (a, v) {
                    ctrl[util.deParen(util.dash2Camel(a))] = function () {
                        scope.$eval(v);
                    };
                }(a, v));
            });
            _.each(annotations.host, function (h) {
                if (!_.empty(attrs[annotations.host[h]])) {
                    (function (h) {
                        element.on(annotations.host[h], function () {
                            ctrl[util.deParen(attrs[annotations.host[h]])]();
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
                ctrl[util.dash2Camel(a)] = v;
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
    AbstractComponentOneX.prototype.coerceOptions = function (userlandCDO) {
        var CDO = userlandCDO;
        CDO.ng1Name = '';
        CDO.restrict = '';
        CDO.templateUrl = '';
        CDO.properties = userlandCDO.properties || [];
        CDO.events = userlandCDO.events || [];
        CDO.host = userlandCDO.host || [];
        CDO.class = userlandCDO.class || function () { };
        CDO.inject = userlandCDO.inject || [];
        CDO.annotations = [];
        CDO.autoNamespace = userlandCDO.autoNamespace || true;
        CDO.isDecorator = false;
        return CDO;
    };
    AbstractComponentOneX.prototype.component = function (name, userlandCDO) {
        var selectorParts = name.split('/'), selector = selectorParts.pop(), isDecorator = selector.indexOf('[') == 0, nativeName = util.deBracket(selector), prefix = selectorParts.pop(), prefixedName = prefix + '-' + nativeName, CDO = this.coerceOptions(userlandCDO);
        CDO.ng1Name = util.dash2Camel(prefixedName);
        CDO.restrict = isDecorator ? 'A' : 'E';
        CDO.annotations = {
            properties: [],
            events: ['change', 'close', 'save', 'destroy'],
            host: ['click']
        };
        if (CDO.templateUrl)
            util.noop();
        else if (isDecorator)
            CDO.templateUrl = null;
        else
            CDO.templateUrl = this.config.componentsDir + selectorParts.join('/') + prefix + '/' + nativeName + '/' + nativeName + '.html';
        _.each(CDO.properties, function (x) {
            CDO.annotations.properties.push(x);
        });
        _.each(CDO.events, function (x) {
            CDO.annotations.events.push(x);
        });
        _.each(CDO.host, function (x) {
            CDO.annotations.host.push(x);
        });
        angular.module(this.config.appName).directive(CDO.ng1Name, this.DDO(CDO));
    };
    return AbstractComponentOneX;
})(AbstractComponent);
/// <reference path="../util.ts"/>
/// <reference path="./abstract/abstract_component.ts"/>
/// <reference path="./abstract/abstract_component.1.x.ts"/>
var ComponentCreators;
(function (ComponentCreators) {
    var ComponentOneThree = (function (_super) {
        __extends(ComponentOneThree, _super);
        function ComponentOneThree() {
            _super.apply(this, arguments);
        }
        return ComponentOneThree;
    })(AbstractComponentOneX);
    ComponentCreators.ComponentOneThree = ComponentOneThree;
})(ComponentCreators || (ComponentCreators = {}));
/// <reference path="../util.ts"/>
/// <reference path="./abstract/abstract_component.ts"/>
/// <reference path="./abstract/abstract_component.1.x.ts"/>
var ComponentCreators;
(function (ComponentCreators) {
    var ComponentOneFour = (function (_super) {
        __extends(ComponentOneFour, _super);
        function ComponentOneFour() {
            _super.apply(this, arguments);
        }
        return ComponentOneFour;
    })(AbstractComponentOneX);
    ComponentCreators.ComponentOneFour = ComponentOneFour;
})(ComponentCreators || (ComponentCreators = {}));
/// <reference path="../util.ts"/>
/// <reference path="./abstract/abstract_component.ts"/>
/// <reference path="./abstract/abstract_component.1.x.ts"/>
var ComponentCreators;
(function (ComponentCreators) {
    var ComponentOneFive = (function (_super) {
        __extends(ComponentOneFive, _super);
        function ComponentOneFive() {
            _super.apply(this, arguments);
        }
        return ComponentOneFive;
    })(AbstractComponentOneX);
    ComponentCreators.ComponentOneFive = ComponentOneFive;
})(ComponentCreators || (ComponentCreators = {}));
/// <reference path="../util.ts"/>
/// <reference path="./abstract/abstract_component.ts"/>
/// <reference path="./abstract/abstract_component.1.x.ts"/>
var ComponentCreators;
(function (ComponentCreators) {
    var ComponentTwoAlpha = (function (_super) {
        __extends(ComponentTwoAlpha, _super);
        function ComponentTwoAlpha() {
            _super.apply(this, arguments);
        }
        return ComponentTwoAlpha;
    })(AbstractComponent);
    ComponentCreators.ComponentTwoAlpha = ComponentTwoAlpha;
})(ComponentCreators || (ComponentCreators = {}));
/// <reference path="../util.ts"/>
/// <reference path="./abstract/abstract_component.ts"/>
/// <reference path="./abstract/abstract_component.1.x.ts"/>
var ComponentCreators;
(function (ComponentCreators) {
    var ComponentLegacy = (function (_super) {
        __extends(ComponentLegacy, _super);
        function ComponentLegacy() {
            _super.apply(this, arguments);
        }
        ComponentLegacy.prototype.DDO = function (CDO) {
            var DDO = {
                restrict: CDO.restrict,
                controller: this.inject(CDO.class, CDO.inject),
                controllerAs: CDO.ng1Name,
                scope: false,
                compile: this.compile(CDO.ng1Name, CDO.annotations, CDO.autoNamespace),
                templateUrl: CDO.templateUrl,
                transclude: !CDO.isDecorator
            };
            return function () {
                return DDO;
            };
        };
        return ComponentLegacy;
    })(AbstractComponentOneX);
    ComponentCreators.ComponentLegacy = ComponentLegacy;
})(ComponentCreators || (ComponentCreators = {}));
/// <reference path="./component/component.1.3.ts"/>
/// <reference path="./component/component.1.4.ts"/>
/// <reference path="./component/component.1.5.ts"/>
/// <reference path="./component/component.2.alpha.ts"/>
/// <reference path="./component/component.legacy.ts"/>
var ngsham;
(function (ngsham) {
    var NgSham = (function () {
        function NgSham() {
            if (NgSham._instance)
                throw new Error('Singleton!');
            NgSham._instance = this;
        }
        NgSham.getInstance = function () {
            return NgSham._instance;
        };
        NgSham.prototype.configure = function (config) {
            this.config = config;
            this.componentCreator = new ComponentCreators[typeof this.config.forceUseComponentCreator === 'string'
                ? this.config.forceUseComponentCreator
                : this.version()](this.config.appName, this.config.componentsDir);
        };
        NgSham.prototype.getComponentCreator = function () {
            if (!this.componentCreator)
                throw new Error('Run NgSham.configure() first!');
            return this.componentCreator;
        };
        NgSham.prototype.shim = function (config) {
            this.configure(config);
            return this.componentCreator.component;
        };
        NgSham.prototype.getConfig = function () {
            return this.config;
        };
        NgSham.prototype.bootstrap = function (controller) {
            if (!this.hasComponentAnnotations(controller))
                return;
            var CDO = this.annotations2CDO(controller);
            this.componentCreator.component(CDO);
        };
        NgSham.prototype.hasComponentAnnotations = function (controller) {
            return !!Reflect.getMetadataKeys(controller);
        };
        NgSham.prototype.annotations2CDO = function (controller) {
            var keys = Reflect.getMetadataKeys(controller), CDO;
            _.each(keys, function () {
            });
            return CDO;
        };
        NgSham.prototype.version = function () {
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
        NgSham._instance = new NgSham();
        return NgSham;
    })();
})(ngsham || (ngsham = {}));
/// <reference path="../../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../util.ts"/>
/// <reference path="../ngsham.ts"/>
var ngsham;
(function (ngsham) {
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
    ngsham.Component = Component;
})(ngsham || (ngsham = {}));
/// <reference path="./ngsham.ts"/>
var ngsham;
(function (ngsham) {
    function bootstrap(controller) {
        NgSham.getInstance.annotations2CDO(controller);
    }
    ngsham.bootstrap = bootstrap;
    window.ngshim = function (appName, angularVersion, componentsDir) {
        window.ngsham = NgSham.getInstance.shim(appName, angularVersion, componentsDir);
        window.ngshambles = NgSham.getInstance.shim(appName, angularVersion, componentsDir, 'ComponentLegacy');
    };
})(ngsham || (ngsham = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponentOne = (function (_super) {
    __extends(AbstractComponentOne, _super);
    function AbstractComponentOne() {
        _super.apply(this, arguments);
    }
    AbstractComponentOne.prototype.reflectParams = function (fn) {
    };
    AbstractComponentOne.prototype.reflectDecor = function (decoratedClass) {
    };
    AbstractComponentOne.prototype.inject = function (fn, deps) {
        fn['$inject'] = deps;
        return fn;
    };
    AbstractComponentOne.prototype.compile = function (ng1Name, annotations, autoNamespace) {
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
    AbstractComponentOne.prototype.convertTemplate = function (templateString, controllerAs, autoNamespace) {
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
    AbstractComponentOne.prototype.linkFn = function (annotations, cachedAttributes, name) {
        return function (scope, element, attrs, ctrl, transclude) {
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
            if (typeof transclude == 'function') {
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
    AbstractComponentOne.prototype.coerceOptions = function (userlandCDO) {
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
    AbstractComponentOne.prototype.component = function (name, userlandCDO) {
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
            CDO.templateUrl = this.componentsDir + selectorParts.join('/') + prefix + '/' + nativeName + '/' + nativeName + '.html';
        _.each(CDO.properties, function (x) {
            CDO.annotations.properties.push(x);
        });
        _.each(CDO.events, function (x) {
            CDO.annotations.events.push(x);
        });
        _.each(CDO.host, function (x) {
            CDO.annotations.host.push(x);
        });
        angular.module(this.appName).directive(CDO.ng1Name, this.DDO(CDO));
    };
    return AbstractComponentOne;
})(AbstractComponent);

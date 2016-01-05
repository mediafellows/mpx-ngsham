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
            throw new Error('Not implemented');
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
            var _this = this;
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
                _this.CDO.annotations.properties.push(x);
            });
            _.each(this.CDO.events, function (x) {
                _this.CDO.annotations.events.push(x);
            });
            _.each(this.CDO.host, function (x) {
                _this.CDO.annotations.host.push(x);
            });
            if (this.config.verbose)
                console.log(this.CDO.ng1Name, this.CDO, this.DDO(this.CDO)());
            angular.module(this.config.appName).directive(this.CDO.ng1Name, this.DDO(this.CDO));
        };
        return AbstractComponentOneX;
    })(NgSham.AbstractComponent);
    NgSham.AbstractComponentOneX = AbstractComponentOneX;
})(NgSham || (NgSham = {}));

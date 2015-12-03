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
                autoNamespace: sth.autoNamespace || true,
                isDecorator: sth.isDecorator || true
            };
            return CDO;
        }
        util.coerceToShamCDO = coerceToShamCDO;
    })(util = NgSham.util || (NgSham.util = {}));
})(NgSham || (NgSham = {}));

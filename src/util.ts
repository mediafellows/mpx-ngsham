module NgSham {
  export namespace util {

    export function noop (): void {};

    export function deBracket (s: string): string {
      return s.replace(/[\[\]]/g, '');
    };

    export function dash2Camel (s: string): string {
      return s.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
    };

    export function isNg2E (s: string): Boolean {
      return /(^\((.+)\)$)/.test(s) || s.indexOf('on-') === 0;
    };

    export function isNg2P (s: string): Boolean {
      return /(^\[(.+)\]$)/.test(s) || s.indexOf('bind-') === 0;
    };

    export function isNg2Attr (s: string): Boolean {
      return isNg2E(s) || isNg2P(s);
    };

    export function deParen (s: string): string {
      return s.replace(/[\(\)]/g, '');
    };

    export function coerceToShamCDO (sth): ShamCDO {
      var CDO: ShamCDO = {
        selector:       sth.selector        || '',
        ng1Name:        sth.ng1Name         || '',
        restrict:       sth.restrict        || '',
        templateUrl:    sth.templateUrl     || false,
        properties:     sth.properties      || [],
        events:         sth.events          || [],
        host:           sth.host            || [],
        class:          sth.class           || function () {},
        inject:         sth.inject          || [],
        annotations: {
          properties:   sth.properties      || [],
          events:       sth.events          || [],
          host:         sth.host            || []
        },
        autoNamespace:  sth.autoNamespace   || true,
        isDecorator:    sth.isDecorator     || true
      }
      return CDO;
    }
  }
}

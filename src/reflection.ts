module NgSham {
  export namespace reflect {
    export function deAnnotate (c: any): ShamCDO {
      var i = new c(), CDO: ShamCDO = {
        selector:       c.prototype.selector      || '',
        ng1Name:        c.prototype.ng1Name       || '',
        restrict:       c.prototype.restrict      || '',
        templateUrl:    c.prototype.templateUrl   || false,
        properties:     c.prototype.properties    || [],
        events:         c.prototype.events        || [],
        host:           c.prototype.host          || [],
        class:          c,
        inject:         c.prototype.inject        || [],
        annotations:    c.prototype.annotations   || {},
        autoNamespace:  c.prototype.autoNamespace || true,
        isDecorator:    c.prototype.isDecorator   || true,
      };
      return CDO;
    }
  }
}

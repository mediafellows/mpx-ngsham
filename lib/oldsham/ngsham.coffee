do (window) ->

  window.ngshim = (appName, angularVersion, componentsDir) ->

    @log = (message, method) ->
      method ||= 'log'
      if console && typeof console[method] == 'function'
        console[method](message)

    appName ||= 'app'
    angularVersion ||= 1
    componentsDir ||= '/components/'

    v = ->
      if angularVersion == 1
        window.ngsham = angular1ComponentCreator(appName, componentsDir)
      else if angularVersion == 2
        window.ngsham = angular2ComponentCreator()

    v()

  angular1ComponentCreator = (appName, componentsDir) ->

    ################################################################################
    # Registers a component from object, or from shorthand of name, controllerFunc.
    # TODO: Support 2-way binding template sugar.
    # TODO: When only one prop/event/attr then accept strings.
    # TODO: Support Ng2 "^" event bubbling.
    # TODO: NgModel support??
    # TODO: NgSham renamed to NgShorthand (ngsh) ??
    # TODO: Re-fix all this PEH stuff... (no more PEH and just host?)

    @component = (name, options) ->

      PEH = properties:[], events:[], hostEvents:[]

      defaultProperties   = []
      defaultEvents       = ['change', 'close', 'save', 'destroy']
      defaultHostEvents   = ['click']

      selectorParts       = name.split '/'
      selector            = selectorParts.pop()
      isDecorator         = selector.indexOf('[') == 0
      nativeName          = @deBracket selector
      prefix              = selectorParts.pop()
      prefixedName        = prefix + '-' + nativeName
      ng1Name             = @dash2Camel prefixedName
      restrict            = if isDecorator then 'A' else 'E'
      controllerFn        = options.class

      if      isDecorator
      then    templateUrl = null
      else if options.view?
      then    templateUrl = componentsDir + prefix + '/' + options.view + '.html'
      else    templateUrl = componentsDir + selectorParts.join('/') + prefix + '/' + nativeName + '/' + nativeName + '.html'

      for p of defaultProperties
        if defaultProperties.hasOwnProperty(p)
          PEH.properties.push defaultProperties[p]

      for p of options.properties
        if options.properties.hasOwnProperty(p)
          PEH.properties.push options.properties[p]

      for e of defaultEvents
        if defaultEvents.hasOwnProperty(e)
          PEH.events.push defaultEvents[e]

      for e of options.events
        if options.events.hasOwnProperty(e)
          PEH.events.push options.events[e]

      for e of defaultHostEvents
        if defaultHostEvents.hasOwnProperty(e)
          PEH.hostEvents.push defaultHostEvents[e]

      for e of options.host
        if options.host.hasOwnProperty(e)
          PEH.hostEvents.push options.host[e]

      DDO =
        restrict:         restrict
        controller:       @inject(controllerFn, options.inject)
        controllerAs:     ng1Name
        scope:            false
        compile:          @compileFn(ng1Name, PEH, options.autoNamespace)
        templateUrl:      templateUrl
        transclude:       !isDecorator

      angular.module(appName).directive(ng1Name, () -> DDO)

    ################################################################################
    # Extract injected controller dependencies...

    @inject = (fn, deps) ->
      fn['$inject'] = deps
      fn

    ################################################################################
    # Converts an Ng2 string template to Ng1 string template.

    @convertTemplate = (templateString, controllerAs, autoNamespace) ->
      autoNamespace = true if !autoNamespace?
      return null unless templateString && controllerAs
      replaceAttrKnown      = "$1=\"$2#{controllerAs}.$3"
      replaceAttrCustom     = "$1$2$3=\"$4#{controllerAs}.$5"
      replaceInterpolation  = "$1#{controllerAs}.$2"
      replaceNgFor          = "ng-repeat=\"$3 in #{controllerAs}.$5"
      templateString        = templateString.replace(/bind-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, '[$1]="$2"')
      templateString        = templateString.replace(/on-([a-zA-Z0-9-_]+)="([a-zA-Z0-9-_]+)/g, "($1)=\"$2\"")
      templateString        = templateString.replace(/\((click)\)/g, 'ng-click')
      templateString        = templateString.replace(/(hidden)="/g, 'ng-hide="')
      if autoNamespace
        templateString        = templateString.replace(/___/g, "#{controllerAs}.")
        templateString        = templateString.replace(/(ng-click|ng-if|ng-change|ng-hide)="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrKnown)
        templateString        = templateString.replace(/([\(\[])([a-zA-Z0-9-_]+)([\)\]])="(!|)([a-zA-Z0-9-_]+)/g, replaceAttrCustom)
        templateString        = templateString.replace(/((\*ng-for="#)([a-zA-Z0-9-_]+)( of )([a-zA-Z0-9-_]+))/g, replaceNgFor)
      templateString        = templateString.replace(/<content select="([a-zA-Z0-9-_]+)">(|.+)<\/content>/g, "<div transclude-id=\"$1\">$2</div>")
      templateString

    ################################################################################
    # Prepares template and attributes.

    @compileFn = (ng1Name, PEH, autoNamespace) ->
      (tElement) =>
        attrs = tElement[0].attributes
        cachedAttributes =
          boundProperties: {}
          boundEvents: {}
          staticAttrs: {}
        for a of attrs
          if attrs.hasOwnProperty(a)
            name = attrs[a].name
            value = attrs[a].value
            if name? && !@isNg2Attr(name)
              cachedAttributes.staticAttrs[name] = value unless name == ng1Name
            else
              if name? && @isNg2P(name) then cachedAttributes.boundProperties[@dash2Camel(name.replace(/^bind-|[\[\]]/g, ''))] = value
              if name? && @isNg2E(name) then cachedAttributes.boundEvents[name.replace(/^on-/, '')] = value

        tElement[0].innerHTML = @convertTemplate tElement[0].innerHTML, ng1Name, autoNamespace
        @linkFn(PEH, cachedAttributes, ng1Name)

    ################################################################################
    # Creates a link function WHICH YOU SHOULD PRETEND DOES NOT EXIST.

    @linkFn = (PEH, cachedAttributes, name) ->
      (scope, element, attrs, ctrl, transclude) ->

        ################################################################################
        # Start parsing the events cached over from compile phase.
        # Assign all the "parenthetical" attributes to "controllerAs" methods.

        for a,v of cachedAttributes.boundEvents
          do (a,v) ->
            ctrl[@deParen(@dash2Camel(a))] = () ->
              scope.$eval(v)

        ################################################################################
        # If some "host" events were given, assign them to "self" methods.

        for h of PEH.hostEvents
          if attrs[PEH.hostEvents[h]]?
            do (h) =>
              element.on PEH.hostEvents[h], () =>
                ctrl[@deParen attrs[PEH.hostEvents[h]]]()

        ################################################################################
        # Assign all the bracketed attributes to watchers.

        watchedProperties = []
        watchedExpressions = []
        _.each cachedAttributes.boundProperties, (v,p) ->
          watchedProperties.push p
          watchedExpressions.push v

        for a,v of cachedAttributes.staticAttrs
          ctrl[@dash2Camel(a)] = v if attrs.hasOwnProperty(a)

        scope.$watchGroup watchedExpressions, (newVal, oldVal) ->
          changed = {}
          for obj,index in newVal
            source = watchedExpressions[index]
            prop   = watchedProperties[index]
            changed[prop] = obj
            ctrl[prop] = obj
          ctrl.onChange?(changed)

        ################################################################################
        # Sham the "activate" function.

        if      typeof ctrl.activate == 'function'
        then    ctrl.activate()
        else if typeof ctrl.___ == 'function'
        then    ctrl.___()

        ################################################################################
        # Support transclusion via the "content" element.

        if typeof transclude == 'function'
          transclude (clones) ->
            angular.forEach clones, (clone) ->
              if selector = clone.tagName
                destination = element.find('[transclude-id="' + selector.toLowerCase() + '"]')
                if destination.length
                then destination.append clone
                else clone.remove()

    ################################################################################
    # Utility functions.

    @deParen        = (s) -> s.replace /[\(\)]/g, ''
    @deBracket      = (s) -> s.replace /[\[\]]/g, ''
    @dash2Camel     = (s) -> s.replace /-([a-z])/g, (g) -> g[1].toUpperCase()
    @isNg2E         = (n) -> /(^\((.+)\)$)/.test(n) || n.indexOf('on-') == 0
    @isNg2P         = (n) -> /(^\[(.+)\]$)/.test(n) || n.indexOf('bind-') == 0
    @isNg2Attr      = (n) -> @isNg2E(n) || @isNg2P(n)
    @endsWith       = (e, s) -> s.indexOf(e, s.length - e.length) != -1;
    @attrs2String   = (n, v) -> "#{n}=\"#{v}\""

    ################################################################################
    # Shortcuts to create OOP controllers/services with the known module name.

    @component.ctrl = (name, fn) ->
      angular.module(appName).controller(name, fn)

    @component.fact = (name, options) =>
      angular.module(appName).factory(name, @inject(options.class, options.inject))

    ################################################################################
    # ngshim will attach the component generator to window as "ngsham"

    @component

  null

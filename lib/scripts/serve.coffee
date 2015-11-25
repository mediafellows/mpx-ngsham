################################################################################
# Requires

fs       = require 'fs-extra'
_        = require 'lodash'
coffee   = require 'coffee-script'
notifier = require 'node-notifier'
sys      = require 'sys'
exec     = require('child_process').exec
del      = require 'del'

################################################################################
# Cfg

externalEditor = 'atom'
__ = '>>>>'

################################################################################
# Should be a library...

flatwhite =
  reIndent: (fromLevel) ->
    return '' if fromLevel < 0
    spaces = ''
    for s in [0..fromLevel]
      spaces += '  '
    spaces

  compile: (code) ->
    code = code.replace(/  /g, '§')
    code = code.replace(/\((.*)\) ->/g, 'function ($1)')
    globalLevel = 0
    localLevel = 0
    lines = code.match /[^\r\n]+/g
    _.each lines, (line, lineNumber) ->
      localLevel = 0
      chars = line.split('')
      _.each chars, (char) ->
        if char == '§' then localLevel++ else return

        if localLevel > globalLevel
          lines[lineNumber-1] = "#{lines[lineNumber-1]} {" if lines[lineNumber-1].split('').pop() != '{'
          globalLevel++
          return

      # console.log localLevel, globalLevel, line

      if localLevel < globalLevel
        newGlobalLevel = globalLevel
        for l in [globalLevel..localLevel]
          if line.indexOf('else') == -1
            lines[lineNumber-1] = "#{lines[lineNumber-1]};" if lines[lineNumber-1].split('').pop() != ';'
            lines[lineNumber-1] = "#{lines[lineNumber-1]}\n#{flatwhite.reIndent(l-1)}};"
          else
            lines[lineNumber] = "#{lines[lineNumber]} {" if lines[lineNumber].split('').pop() != '{'
          newGlobalLevel--
        globalLevel = newGlobalLevel

    # _.each lines, (line, lineNumber) ->
    #   if line.split('').pop() != '{'
    #     lines[lineNumber] = "#{line}4;"

    code = lines.join('\n').replace(/§/g, '  ')
    # code = code.replace(/(for|if)([^}]+)(};)/gm, '$1$2}')
    code = code.replace(/else/g, '} else')
    code = "#{code}\n#{flatwhite.reIndent(globalLevel-2)}" if globalLevel > 1
    for l in [globalLevel-2..-1]
      code = "#{code}};\n#{flatwhite.reIndent(l-1)}"

    return code

################################################################################
# Functions

putsth = (error, stdout, stderr) ->
  sys.puts stdout

clean = ->
  fs.removeSync 'dist'
  fs.mkdirsSync 'dist'

handleError = (title, message, openAfter, offendingFile) ->
  console.log __, message
  notifier.notify
    title: title
    message: message?.toString()
  exec "#{externalEditor} #{offendingFile}", putsth if openAfter?
  process.exit 1

compile = (what, where, to) ->
  _.each fs.readdirSync(where), (fileName) ->
    pattern = new RegExp("\.#{what}$")
    compilers[what] "#{where}/#{fileName}", "#{to}/#{fileName}" if pattern.test(fileName)

compilers =

  flatwhite: (path, dest) ->
    fw = fs.readFileSync path, 'utf-8'
    tsDest = "#{dest.substr 0, dest.lastIndexOf '.flatwhite'}.ts"
    try ts = flatwhite.compile fw
    catch error then handleError('FlatWhite', error)
    fs.writeFileSync tsDest, ts
    console.log __, "FlatWhite compiled #{tsDest}."

  coffee: (path, dest) ->
    cs = fs.readFileSync path, 'utf-8'
    tsDest = "#{dest.substr 0, dest.lastIndexOf '.coffee'}.ts"
    try ts = coffee.compile cs
    catch error then handleError('Coffee Script', error)
    fs.writeFileSync tsDest, ts
    console.log __, "Kaffee compiled #{tsDest}."

  ts: (path, dest) ->
    ts = fs.readFileSync path, 'utf-8'
    jsSrc = path.replace(/\.ts$/, '.js')
    jsDest = "#{dest.substr 0, dest.lastIndexOf '.ts'}.js"
    try exec "tsc", putsth
    catch error then handleError('TypeScript', error, 'then open', path)
    console.log __, "TypeScript compiled #{jsDest}."

reload = ->
  console.log 'Reloading the browser now...'
  exec.exec 'curl http://localhost:35729/changed?files=index.html'

server = ->
  file = new nstatic.Server './dist'
  http.createServer (req, resp) ->
    req.addListener 'end', ->
      file.serve req, resp
    .resume()
  .listen(3000)

  console.log 'Listening on port 3000.'

  watch ['src', '/Users/jasongrier/Desktop/mp/repos/mpx-frontend/dist/scripts/frontend.js'], (path) ->
    install()
    copyLibs()
    copyIndex()
    compileApp()
    compileComponents()
    writeConcatenatedCss()
    reload()

  port = 35729
  tinylr().listen port, () ->
    console.log "Live reload listening on port #{port}."

################################################################################
# Tasks

clean()
compile 'flatwhite',    'src/flatwhite',   'src/ts'
# compile 'ts',         'dist',  'dist'

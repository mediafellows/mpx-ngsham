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
  compile: (code) ->
    code = code.replace(/  /g, '§')
    code = code.replace('() ->', 'function ()')
    globalLevel = 0
    localLevel = 0
    lines = code.match /[^\r\n]+/g
    _.each lines, (line, lineNumber) ->
      localLevel = 0
      chars = line.split('')
      _.each chars, (char) ->
        if char == '§' then localLevel++ else return

        if localLevel > globalLevel
          lines[lineNumber-1] = "#{lines[lineNumber-1]} {"
          globalLevel++
          return

      if localLevel < globalLevel
        newGlobalLevel = globalLevel
        for l in [globalLevel..localLevel]
          lines[lineNumber] = "#{line}};"
          newGlobalLevel--
        globalLevel = newGlobalLevel

    _.each lines, (line, lineNumber) ->
      if line.split('').pop() != '{'
        lines[lineNumber] = "#{lines[lineNumber]};"

    code = lines.join('\n').replace(/§/g, '  ')
    code = code.replace(/(for)(.+)(};)/g, '$1$2}')
    for l in [globalLevel..1]
      code = "#{String.fromCharCode(13)}#{code}};"

    console.log code
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
    tsDest = "#{dest.substr 0, dest.lastIndexOf '.fw'}.ts"
    try ts = flatwhite.compile fw
    catch error then handleError('FlatWhite', error)
    # console.log ts
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

################################################################################
# Requires

fs       = require 'fs-extra'
_        = require 'lodash'
notifier = require 'node-notifier'
sys      = require 'sys'
exec     = require('child_process').exec
del      = require 'del'
nstatic  = require 'node-static'
http     = require 'http'
tinylr   = require 'tiny-lr'
watch    = require 'node-watch'
coffee   = require 'coffee-script'

################################################################################
# Vars

__ = '>>>>>'

################################################################################
# Functions

handleError = (title, message, openAfter, offendingFile) ->
  console.log __, message
  notifier.notify
    title: title
    message: message?.toString()
  process.exit 1

putsth = (error, stdout, stderr) ->
  sys.puts(stdout)
  fs.copySync('./dist/ngsham.js', './lib/demo/ngsham.js')
  fs.copySync('./dist/ngsham.js.map', './lib/demo/ngsham.js.map')
  fs.copySync('./node_modules/angular/angular.js', './lib/demo/angular.js')
  try js = coffee.compile(fs.readFileSync('./lib/demo/app.coffee', 'utf-8'))
  catch error then handleError 'Coffee Script', error.toString()
  fs.writeFileSync('./lib/demo/app.js', js)
  reload()

clean = ->
  fs.removeSync 'dist'
  fs.mkdirsSync 'dist'

compile = (cb) ->
  try exec('tsc', putsth)
  catch error then handleError('TypeScript', error)
  console.log __, "TypeScript compiled."

reload = ->
  console.log 'Reloading the browser now...'
  exec('curl http://localhost:35729/changed?files=index.html')

serve = ->
  file = new nstatic.Server './lib/demo'
  http.createServer (req, resp) ->
    req.addListener 'end', ->
      file.serve req, resp
    .resume()
  .listen(3000)

  console.log 'Listening on port 3000.'

  watch ['src', './lib/demo/index.html', './lib/demo/app.coffee'], (path) ->
    compile()

  port = 35729
  tinylr().listen port, () ->
    console.log "Live reload listening on port #{port}."

################################################################################
# Tasks

clean()
compile()
serve()

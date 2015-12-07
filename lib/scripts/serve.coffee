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
concat   = require 'concat'
npath    = require 'path'

################################################################################
# Vars

__ = '>>>>>'

################################################################################
# Main build functions

handleError = (title, message, openAfter, offendingFile) ->
  console.log __, message
  notifier.notify
    title: title
    message: message?.toString()
  process.exit 1

putsth = (error, stdout, stderr) ->
  sys.puts(stdout)
  buildDemo()

clean = ->
  fs.removeSync './dist'
  fs.mkdirsSync './dist'

compile = (cb) ->
  console.log __, 'Compiling NgSham TypeScript...'
  try exec('tsc', putsth)
  catch error then handleError('TypeScript', error)

################################################################################
# Build demo functions

coffeeComponentsString = tsComponentsString = ''

buildDemo = ->
  cleanDemo()
  compileDemoTypescript()

putsthDemo = (error, stdout, stderr) ->
  sys.puts(stdout)
  compileADirectory('./lib/demo/src', './lib/demo/dist', false)
  compileADirectory('./lib/demo/tmp', false, true)
  copyDemo()
  reload()

cleanDemo = ->
  console.log __, 'Deleting and re-creating demo dist and demo tmp dirs...'
  fs.removeSync './lib/demo/dist'
  fs.mkdirsSync './lib/demo/dist'
  fs.removeSync './lib/demo/tmp'
  fs.mkdirsSync './lib/demo/tmp'

compileDemoTypescript = ->
  console.log __, 'Compiling demo TypeScript...'
  try exec('cd ./lib/demo && tsc', putsthDemo)
  catch error then handleError('TypeScript', error)

compileCoffee = (path, dest) ->
  cs = fs.readFileSync path, 'utf-8'
  jsDest = "#{dest.substr 0, dest.lastIndexOf '.coffee'}.js"
  try js = coffee.compile cs
  catch error then handleError 'Coffee Script', error.toString()
  if (path == './lib/demo/src/app.coffee')
    fs.writeFileSync(jsDest, js)
  else
    coffeeComponentsString += js

  # TODO: Typescript and Coffescript shold be compiled in the same ways...
  console.log "Compiled #{path}."

compileADirectory = (path, dest, tsTmp, depth) ->
  path  ||= 'src/components'
  dest  ||= 'dist/components'
  depth ||= 0
  return if ++depth > 10

  console.log __, 'Compiling demo Components...' if depth == 0

  _.each fs.readdirSync(path), (file) ->
    return if file == '.DS_Store'

    iteratePath = "#{path}/#{file}"
    iterateDest = "#{dest}/#{file}"

    if fs.statSync(iteratePath).isDirectory()
      fs.mkdirsSync iterateDest
      compileADirectory iteratePath, iterateDest, tsTmp, depth
    else if npath.extname(iteratePath) == '.coffee'
      compileCoffee iteratePath, iterateDest
    else if npath.extname(iteratePath) == '.scss'
      compileScss iteratePath, iterateDest
    else if npath.extname(iteratePath) == '.js'
      tsComponentsString += fs.readFileSync(iteratePath, 'utf-8') if tsTmp == true
    else if npath.extname(iteratePath) == '.ts'
      # Do nothing...
    else if dest != false
      fs.copySync iteratePath, iterateDest
      console.log __, "Copied: #{iterateDest}"

copyDemo = ->
  fs.copySync('./dist/ngsham.js',                     './lib/demo/dist/lib/ngsham.js')
  fs.copySync('./node_modules/angular/angular.js',    './lib/demo/dist/lib/angular.js')
  fs.copySync('./node_modules/lodash/index.js',       './lib/demo/dist/lib/lodash.js')
  fs.copySync('./node_modules/jquery/dist/jquery.js', './lib/demo/dist/lib/jquery.js')
  console.log __, "Copied demo libraries."
  fs.writeFileSync './lib/demo/dist/components.coffee.js', coffeeComponentsString
  console.log __, "Wrote: components.coffee.js"
  fs.writeFileSync './lib/demo/dist/components.ts.js', tsComponentsString
  console.log __, "Wrote: components.ts.js"

reload = ->
  console.log 'Reloading the browser now...'
  exec('curl http://localhost:35729/changed?files=index.html')

serve = ->
  file = new nstatic.Server './lib/demo/dist'
  http.createServer (req, resp) ->
    req.addListener 'end', ->
      file.serve req, resp
    .resume()
  .listen(3000)

  console.log 'Listening on port 3000.'

  watch [
    './src',
    './lib/demo/src/index.html',
    './lib/demo/src/app.coffee',
    './lib/demo/src/components'
  ],
  (path) ->
    coffeeComponentsString = ''
    tsComponentsString = ''
    compile()

  port = 35729
  tinylr().listen port, () ->
    console.log "Live reload listening on port #{port}."

################################################################################
# Tasks

clean()
compile()
serve()

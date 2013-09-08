fs = require('fs')
path = require('path')
coffee = require('coffee-script')
mkdirp = require('mkdirp')
{Future} = require('../../utils/Future')
{BuildTask} = require('./BuildTask')


class CompileCoffeeScript extends BuildTask

  run: ->
    dirname = path.dirname(@params.file)
    basename = path.basename(@params.file, '.coffee')

    src = "#{ @params.baseDir }/#{ @params.file }"
    dst = "#{ @params.targetDir }/#{ dirname }/#{ basename }.js"

    f = Future.call(fs.readFile, src).map (data) ->
      coffee.compile data.toString(),
        compile: true
        bare: true
    .zip(Future.call(mkdirp, path.dirname(dst))).flatMap (jsString) =>
      Future.call(fs.writeFile, dst, jsString)
    .failAloud()

    @readyPromise.when(f)


  getWorkload: -> 1



exports.CompileCoffeeScript = CompileCoffeeScript

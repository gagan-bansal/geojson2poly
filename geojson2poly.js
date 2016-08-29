#!/usr/bin/env node
var extract = require('geojson-extract-geometries')
var fs = require('fs')
var path = require('path')
var argv = require('yargs')
  .usage('Usage: $0 <geojson-file> <output-poly-file>')
  .demand(2)
  .help('h')
  .alias('h', 'help')
  .argv
fs.readFile(path.resolve(argv._[0]), function(err, data) {
  if (err) throw err
  var geojson = JSON.parse(data)
  var polies = extract(geojson,'Polygon')
  var name = path.basename(argv._[1]).split('.')[0]
  var file = fs.createWriteStream(argv._[1])
  file.on('error', function(err) { throw err})
  polies.forEach(function(poly,ind) {
    file.write(name + '-'+ ind + '\n' + 1 + '\n')
    poly.coordinates[0].forEach(function(p) {
      file.write('\t' + p.join('\t') + '\n')
    })
    file.write('END\nEND\n')
  })
  file.end()
  console.log('Done!')
})

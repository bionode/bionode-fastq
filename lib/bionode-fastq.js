var fs = require('fs')
var Stream = require('stream')
var readline = require('readline')

var events = require('events')

var block = []

var toObject = function (block) {
  return {
    name: block[0],
    seq: block[1],
    name2: block[2],
    qual: block[3]
  }
}

var fastq = new events.EventEmitter()
fastq.read = function (path) {
  var instream = fs.createReadStream(path)
  var outstream = new Stream()
  var rl = readline.createInterface(instream, outstream)

  rl.on('line', function (line) {
    block.push(line)
    if (block.length === 4) {
      var obj = toObject(block)
      fastq.emit('data', obj)
      block = []
    }
  })

  rl.on('close', function () {
    fastq.emit('end')
  })
  return this
}

module.exports = fastq

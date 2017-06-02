var through = require('through2')
var pumpify = require('pumpify')
var split = require('split2')
var fs = require('fs')

module.exports = fastq

// parses
function jsParse () {
  //var flag = false
  var arrayData = new Array()
  var stream = through.obj(transform) //, flush)
  return stream
  function transform (obj, enc, cb) {
    /* checks if stream from split is in the fourth element of
    each read in fastq and pushes it to this stream, saving a
    json with four elements of object data*/
    if (arrayData.length === 3) {
      /* checks if trimmed object is not empty
      which is usefull when fastq have blank lines*/
      if (obj.trim() !== "") {
        arrayData.push(obj)
        // json to push
        var data = {
          name: arrayData[0],
          seq: arrayData[1],
          name2: arrayData[2],
          qual: arrayData[3]
        }
        /* each push clears the arrayData, allowing it to save
        the new read in the next stream from split */
        arrayData = []
        // log to test if data is properly formatted before pushing it
        //console.log(data)
        // push the transformed JSON to stream
        this.push(JSON.stringify(data))
      }
    } else if (obj.startsWith('@') && arrayData.length === 0) {
      /* checks for new read with a double check by @ character and if
      arrayData is still empty*/
      arrayData.push(obj)
    } else {
      /* push everything else to array and checks if trimmed
      object is not empty which is useful when fastq have blank
      lines*/
      if (obj.trim() !== "") {
        arrayData.push(obj)
      }
    }
    cb()
  }
  //function flush () { this.push(null) }
}

// creates flow between the two streams
var fastqPump = pumpify(split(), jsParse())

// input file must be the arg1
function fastq(input_file) {
  fs.createReadStream(input_file)
    // splits file into lines
    .pipe(fastqPump)
}

// executes test dataset
fastq('../test/data/sample.fq')

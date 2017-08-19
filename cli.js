#!/usr/bin/env node
var fs = require('fs')
var minimist = require('minimist')
var fastq = require('./index')

var argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h'
  }
})

if (argv.help || argv._.length === 0) {
  console.log(
        'Usage: bionode-fastq <options> <fastq file [required]> <output file>\n' +
        'If no output is provided, the result will be printed to stdout\n'
    )
  process.exit(0)
}

// if there is an output file present, write to the file. Otherwise write to stdout
var output = argv._[1] ? fs.createWriteStream(argv._[1]) : process.stdout

var fq = fastq.read(argv._[0])

process.stdin.setEncoding('utf8')

fq.on('data', function (data) {
  output.write(JSON.stringify(data) + '\n')
})

fq.on('error', function (err) {
  console.log(
        'There was an error:\n' +
        err
    )
})

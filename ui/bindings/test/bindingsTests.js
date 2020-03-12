'use strict';

const bindings = require('../controllers/bindings');
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('bindings');
//const rscript = require('r-script');
const path = require('path');
const net = require('net');
const fn = require('../controllers/generalFunctions');
const rules = require('../controllers/rules');
const processJson = require('../controllers/processJson');
const request = require('request');
const exec = require('child_process').exec;
var assert = require('chai').assert;
var expect = require('chai').expect;
const RParse = require('./R').parse;
const fs = require('fs')

let binding = {
    "id":"insyde",
    "plot":"plotFigure1(he,modelOutput)",
    "file":"main.Rmd"
};

//bindings.implementExtractR(binding);

context('Extract code lines from plot function', function() {
    let file = fn.readRmarkdown(binding.id, binding.file);
    let lines = file.split('\n');
    let chunksLineNumbers = fn.extractChunks(lines);
    let code = fn.extractCodeFromChunks(lines,chunksLineNumbers.start,chunksLineNumbers.end);
    console.log(JSON.stringify(code))
    fs.writeFile('code.json', code.toString(), 'utf-8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');

    })
    // let codeAsJson = RParse(code);
    // console.log(codeAsJson)
    


})



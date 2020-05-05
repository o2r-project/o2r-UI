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


let binding = {
    "id":"insyde",
    "plot":"plotFigure1",
    "file":"main.Rmd"
};

//bindings.implementExtractR(binding);

context('Extract code lines from plot function', function() {
    let file = fn.readRmarkdown(binding.id, binding.file);
    let lines = file.split('\n');
    let chunksLineNumbers = fn.extractChunks(lines);
    let code = fn.extractCodeFromChunks(lines,chunksLineNumbers.start,chunksLineNumbers.end);
    //let codeAsJson = RParse(code);
   // let call = processJson.findPlotLines(binding.plot)
    //console.log(codeAsJson);
    console.log(code)
    // let codeLines= slice(codeAsJson, call);
    // codeLines = processJson.correctErrorsOfAlgorithm(codeLines);
    // codeLines = processJson.connectCodeLines(codeLines);
    console.log(codeLines)
})



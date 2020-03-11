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
    "plot":"plotFigure1(he,modelOutput)",
    "file":"main.Rmd"
};

bindings.implementExtractR(binding);

context('Extract code lines from plot function', function() {
    let file = fn.readRmarkdown(binding.id, binding.file);
    let lines = file.split('\n');
    let chunksLineNumbers = fn.extractChunks(lines);
    let code = fn.extractCodeFromChunks(lines,chunksLineNumbers.start,chunksLineNumbers.end);
    let codeAsJson = fn.codeAsJson(code);
    

    it('Rmarkdown must be of type string', function() {
        assert.isString(file, 'is array of numbers');
    })
    it('Splitting creates non-empty array', function() {
        assert.isArray(lines);
        expect(lines).to.have.lengthOf(432);
    })
    it('The two arrays "start" and "end" are of equal length, i.e. length=1', function() {
        assert.isObject(chunksLineNumbers);
        expect(chunksLineNumbers.start).to.have.lengthOf(1);
        expect(chunksLineNumbers.start).to.have.lengthOf(chunksLineNumbers.end.length);
    })
    it('There are 400 code lines including empty lines and comments coming from 1 chunk', function() {
        assert.isArray(code);
        assert.isArray(code[0]);
        expect(code[0]).to.have.lengthOf(403);
    })
    it('253 JSON objects, one for each code line', function() {
        assert.isArray(codeAsJson);
        expect(codeAsJson).to.have.lengthOf(253);
        //for (let i=0;i<codeAsJson.length;i++){
        //    console.log(codeAsJson[i])
        //}
    })
    it('253 JSON objects enriched by code type', function() {
        expect(codeAsJsonWithTypes).to.have.lengthOf(253);
        expect(codeAsJson[0].codeType).to.equal("library");
        //Some codelines have empty codetypes, why? 
        for (let i=0;i<codeAsJsonWithTypes.length;i++){
            //console.log(codeAsJsonWithTypes[i])
            //h <- (h > 0) * h is not recognized
            //h <- h > 0) * h is recognized
            //Seems like there is an issue with the brackets
            expect(codeAsJsonWithTypes[i].codeType).to.not.equal('');
            expect(codeAsJsonWithTypes[i].codeType).to.not.equal(undefined);
        }
    })
    it('Transform array to JSON', function() {
        expect(codeAsJson2.length).to.be.equal(253);
        console.log("length",codeAsJson2.length)
    })
})



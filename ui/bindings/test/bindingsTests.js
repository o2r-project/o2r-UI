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

let obj = {"id":"insyde","plot":"plotFigure1(he,modelOutput)","file":"main.Rmd"};
bindings.implementExtractR(obj, "");
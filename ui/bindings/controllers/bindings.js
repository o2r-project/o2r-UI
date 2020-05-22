/*
 * (C) Copyright 2017 o2r project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('bindings');
//const rscript = require('r-script');
const path = require('path');
const net = require('net');
const fn = require('./generalFunctions');
const rules = require('./rules');
const processJson = require('./processJson');
const request = require('request');
const exec = require('child_process').exec;

const baseUrl = "http://localhost:";
let bindings = {};
let runningPorts = [];

bindings.start = (conf) => {
    return new Promise((resolve, reject) => {
        debug('Start bindings service');

        const app = express();
              app.use(bodyParser.json());
              app.use(bodyParser.urlencoded({extended: true}));

        app.post('/api/v1/bindings/extractRcode', function(req, res) {
            bindings.extractRcode(req.body, res);
        });
   
        app.post('/api/v1/bindings/searchBinding', function ( req, res ) {
            bindings.searchBinding( req.body, res);
        });

        app.post('/api/v1/bindings/binding', function(req, res) {
            bindings.createBinding(req.body, res);
        });

        app.get('/api/v1/compendium/:compendium/binding/:binding', function(req, res) {
            let compendium = req.params.compendium;
            let binding = req.params.binding;
            debug('Start getting image for %s from compendium: %s', binding, compendium);
            debug('Extracted query parameters: %s', Object.keys(req.query).length);
            let queryParameters = '';
            if ( Object.keys(req.query).length > 0 ) {
                queryParameters = '?';
                for ( let i = 0; i < Object.keys(req.query).length; i++ ) {
                    queryParameters = queryParameters + "newValue" + i + "=" + req.query["newValue"+i];
                    if ( i +1 < Object.keys(req.query).length ) {
                        queryParameters = queryParameters + "&";
                    } 
                }
            }
            debug('Created url: %s', queryParameters);
            debug('Number of saved ports: %s', runningPorts.length)
            let running = runningPorts.find(function(elem) {
                return elem.result === compendium + binding;
            });
            debug('Port %s for result %s in compendium %s', running.port, binding, compendium)
            var request_options = {
                url: baseUrl + running.port + "/" + binding + queryParameters,
            };
            debug('Created URL: %s', request_options.url)

            var req_pipe = request(request_options);
                req_pipe.pipe(res);        
                req_pipe.on('error', function(e){
                    console.log(e);
                });
                req.on('end', function(){
                    console.log('end');
                    req_pipe.abort();
                });
                req.on('close', function(){
                    console.log('close');
                    req_pipe.abort();
                });
        });
        
        app.post('/api/v1/compendium/:compendium/binding/:binding', function(req, res) {
            let compendium = req.params.compendium;
            let binding = req.params.binding;

            if ( runningPorts.length < 1 ) {
                debug('RunningPorts list epty so far. Start running plumber service for compendium %s and result %s', compendium, binding);
                let newPort = 5000;
                runningPorts.push({
                    result: compendium+binding,
                    port: newPort
                });
                debug('Saved %s of compendium %s under port %s', binding, compendium, newPort);
                bindings.runR(req.body, runningPorts[runningPorts.length-1]);
            } else {
                let included = false;
                runningPorts.forEach( function (elem) {
                    if ( elem.result === compendium + binding ) {
                        included = true;
                        debug('Service for binding already running');
                        if(req.body.preview && elem.pid){
                            debug('Recrate Port' + elem.port); 

                            var kill= exec('kill '+ (elem.pid+1)
                            ,function(err) {
                                debug(err)
                            })

                            kill.on('close', () => setTimeout(() => {
                                debug("try"); bindings.runR(req.body, elem)}
                            , 1000));
                        }
                    }
                })
                if ( !included ) {
                    debug('Start running plumber service for compendium %s and result %s', compendium, binding);
                    let newPort = 5000 + runningPorts.length;
                    runningPorts.push({
                        result: compendium+binding,
                        port: newPort
                    });
                    debug('Saved %s of compendium %s under port %s', binding, compendium, newPort);
                    bindings.runR(req.body, runningPorts[runningPorts.length-1]);
                }
            }

            res.send({
                callback: 'ok',
                data: req.body});
        });
        let bindingsListen = app.listen(conf.port, () => {
            debug('Bindings server listening on port %s', conf.port);
            resolve(bindingsListen);
        });
    });
};

/*var cron = require('node-cron');
 
cron.schedule('* * * * *', () => {
    //debug('cleaning up containers');
    // durch container-Liste durchgehen
    // alle container älter als 25 stunden stoppen und aus der container-Liste entfernen

});*/

bindings.createBinding = function(binding, response) {
    debug( 'Start creating binding for result: %s, compendium: %s', binding.computationalResult.result, binding.id );
    let mainfile = fn.readRmarkdown( binding.id, binding.sourcecode.file );
    let figureSize = fn.extractFigureSize( binding, mainfile );
    //Implementation not finished: fn.modifyMainfile( fileContent, binding.computationalResult, binding.sourcecode.file, binding.id );
    mainfile = mainfile.split('\n');
    let chunksLineNumbers = fn.extractChunks(mainfile);
    let code = fn.extractCodeFromChunks( mainfile, chunksLineNumbers.start, chunksLineNumbers.end );
    let libraries = fn.findLibraries ( code, binding.computationalResult.line );
    let bindingCodelines = binding.sourcecode.codelines.concat(libraries)
        bindingCodelines = fn.handleCodeLines( bindingCodelines );
        console.log(JSON.stringify(bindingCodelines))
    let bindingCode = fn.extractCode( code, bindingCodelines );
        bindingCode = fn.replaceVariable( bindingCode, binding.sourcecode.parameter );
    let wrappedBindingCode = fn.wrapCode( bindingCode, binding.computationalResult.result, binding.sourcecode.parameter, figureSize );
    fn.saveResult( wrappedBindingCode, binding.id, binding.computationalResult.result.replace(/\s/g, '').toLowerCase() );
    binding.codesnippet = binding.computationalResult.result.replace(/\s/g, '').toLowerCase() + '.R';
    response.send({
        callback: 'ok',
        data: binding});
};

bindings.extractRcode = function ( compendium, response ) {
    debug('Start extracting codelines: %s', JSON.stringify(compendium));
    let file = fn.readRmarkdown(compendium.id, compendium.file);
    let lines = file.split('\n');
    let chunksLineNumbers = fn.extractChunks(lines);
    let code = fn.extractCodeFromChunks( lines, chunksLineNumbers.start, chunksLineNumbers.end );
    debug('End extracting codelines: %s', JSON.stringify(compendium));
    response.send({
        callback: 'ok',
        data: code
    })
};

bindings.searchBinding = function ( req, res) {
    var searchTerm= req.term
    var metadata= req.metadata
    debug( 'Start searching for %s', searchTerm,);
    let figures = [];
    let newCode = '';
    
    for(var i in metadata.interaction){
        let fileContent = fn.readRmarkdown( metadata.interaction[i].id, metadata.interaction[i].sourcecode.file );
        let codelines = fn.handleCodeLines( metadata.interaction[i].sourcecode.codelines );
        let extractedCode = fn.extractCode( fileContent, codelines );
              
        if ( extractedCode.indexOf(searchTerm) != -1 ) {
            figures.push(metadata.interaction[i].computationalResult.result);
            debug( 'Found ', searchTerm, ' in ', metadata.interaction[i].computationalResult.result)
        }
        else {
            debug( 'Not Found ', searchTerm, ' in ', metadata.interaction[i].computationalResult.result)
        }
    }

    debug( 'End searching for %s', searchTerm);
    res.send({
        callback: 'ok',
        data:figures,
        code:newCode
    });
};

/*bindings.showFigureDataCode = function(binding) {
    debug('Start creating the binding %s for the result %s',
        binding.purpose, binding.figure);
    let fileContent = fn.readRmarkdown(binding.id, binding.mainfile);
    let codeLines = fn.handleCodeLines(binding.codeLines);
    let extractedCode = fn.extractCode(fileContent, codeLines);
    fn.saveResult(extractedCode, binding.id, binding.figure);
    let dataContent = fn.readCsv(binding.id, binding.dataset);
    let extractedData = fn.extractData(dataContent, bindings.dataset);
    fn.saveDatasets(extractedCode, binding.id,
        binding.figure.replace(/\s/g, '').toLowerCase());
    // fn.modifyMainfile(binding, fileContent);
};*/

bindings.runR = function ( binding, port ) {
    let server = net.createServer(function(socket) {
        socket.write('Echo server\r\n');
        socket.pipe(socket);
    });
    
        server.listen(port.port, 'localhost');
        server.on('error', function (e) {
            debug(e)
            debug("port %s is not free", port.port);
        });
        server.on('listening', function ( e ) {
            server.close();
            debug("port %s is free", port.port);
            var r = exec('R -e '+ 
                '"library("plumber"); '
                + "setwd('" + path.join('tmp', 'o2r', 'compendium', binding.id) + "'); "
                + "path = paste('" + binding.computationalResult.result.replace(/\s/g, '').toLowerCase() + ".R', sep = ''); "
                + "r <- plumb(path); " 
                + "r\\$run(host = '0.0.0.0', port=" + port.port + ");"
                + '"', 
                function(err) {
                    debug(err)
                    //if (err) throw err;
                });
            for(var elem of runningPorts){
                if (elem.result === binding.id + binding.computationalResult.result.replace(/\s/g, '').toLowerCase()){
                    elem.pid = r.pid
                }
            }
        });
        server.close(function () {
            console.log('server stopped');
        });
};

module.exports = bindings;

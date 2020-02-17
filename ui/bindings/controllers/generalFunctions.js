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

const config = require('../config/config');
const fs = require('fs');
const debug = require('debug')('bindings');
const path = require('path');
const exec = require('child_process').exec;

let fn = {};

fn.readRmarkdown = function(compendiumId, mainfile) {
    debug('Start reading RMarkdown %s from the compendium %s', mainfile, compendiumId);
    if ( !compendiumId | !mainfile ) {
        throw new Error('File does not exist.');
    }
    let paper = path.join(config.fs.compendium, compendiumId, mainfile);
    fs.exists(paper, function(exists) {
        if (!exists) {
            debug('Cannot open file %s', paper);
            throw new Error('File does not exist.');
        }

        debug('Start reading RMarkdown');
        return fs.readFileSync(paper, 'utf8');
    });
};

fn.modifyMainfile = function(fileContent, result, file, compendiumId) {
    debug('Start modifying file %s from %s for %s', file, compendiumId, result.result);
    if (result.type == 'number') {
        /* let splitFileContent = fileContent.split('\n');
        let lor = binding.lineOfResult-1;
            splitFileContent[lor] = splitFileContent[lor].replace(new RegExp(binding.result), '__' + binding.result + '__');
        let newContent = '';
            splitFileContent.forEach(function(elem) {
                newContent = newContent + elem + '\n';
            });
        fn.saveRmarkdown(newContent, binding.id, binding.mainfile); 
        debug('End modifying file');*/
    } else if (result.type == 'figure') {
        fileContent = fileContent.replace(new RegExp(result.result, 'g'), '**_' + result.result + '_**');
        fn.saveRFile(fileContent, compendiumId, file);
        //exec('Rscript -e "rmarkdown::render(\'' + path.join(config.fs.compendium, compendiumId, file) + '\', output_file = ' + "'display.html'" + ')"', function(err) {
        //    if (err) throw err;
        //});
        debug('End modifying file');
    }
};

fn.replaceVariable = function(code, parameter) {
    let newContent = code;
    for (let i = 0; i < parameter.length; i++) {
        debug('Start replacing parameter %s', parameter[i].text);
        newContent = newContent.replace(parameter[i].text, parameter[i].name + ' = newValue' + i);
    }
    debug('End replacing parameter');
    return newContent;
};

fn.handleCodeLines = function(lines) {
    debug('Start handling code lines');
    let codelines = [];
    lines.forEach(function(elem) {
        for (let i = elem.start; i <= elem.end; i++) {
            codelines.push(Number(i)-1); // -1 is required as the code lines from the front end start counting at 1.
        };
    });
    debug('End handling code lines');
    return codelines.sort(function(a, b) {
        return a-b;
    });
};

fn.extractCode = function(fileContent, codelines) {
    debug('Start extracting code');
    let newContent = '';
    let splitFileContent = fileContent.split('\n');
    codelines.forEach(function(elem) {
        newContent += splitFileContent[elem] + '\n';
    });
    debug('End extracting code');
    return newContent;
};

fn.extractFigureSize = function (binding, fileContent){
    debug('Start extracting figure width');
    let figureSize = '';
    let splitFileContent = fileContent.split('\n');
    splitFileContent.forEach(function(elem) {
        if ( elem.indexOf("out.width=")>=0 ) {
            debug(elem.split('out.width=')[1].split('}')[0])
            figureSize=elem.split('out.width=')[1].split('}')[0];
        }
    });
    debug(figureSize);
    debug('End extracting figure width');
    return figureSize;
}

fn.wrapCode = function(sourcecode, result, parameter, figureSize) {
    debug('Start wrapping code');
    let input = 'function(';
    let transform = '';
    for (let i=0;i<parameter.length;i++) {
        input = input + 'newValue' + i;
        if(i+1!=parameter.length){
            input=input+',';
        }
        if (!isNaN(parameter[i].val)) {
            transform = transform + 'newValue' + i + '=as.numeric(newValue' + i + ') \n'; 
        } else if (parameter[i].val === 'false' || parameter[i].val === 'FALSE' || parameter[i].val === 'true' || parameter[i].val === 'TRUE') {
            transform = transform + 'newValue' + i + '= as.logical(newValue'+ i + ') \n';
        }
    }
    input=input+') { \n';
    let get = "#' @get /" + result.replace(/\s/g, '').toLowerCase() + '\n' +
                "#' @png (width = "+figureSize+") \n" +
                input +
                'startAnalysis <- Sys.time() \n' + 
                transform;
    let code = sourcecode.split('\n');
        //code[code.length-2] = 'print(' + code[code.length-2] + ')';
    let newCode = '';
        code.forEach(function(elem) {
            newCode += elem + '\n';
        });
    let newContent = get + newCode + 'endAnalysis <- Sys.time() \n' + 
                                    'totaltime <- difftime(endAnalysis, startAnalysis, units="secs") \n' +
                                    'message(paste("Total time is: ", totaltime)) \n' +  
                                    '}';
    debug('End wrapping code');
    return newContent;
};

fn.readCsv = function(compendiumId, datasets) {
    if ( !compendiumId | datasets ) {
        throw new Error('File does not exist.');
    }
    let datafile = path.join(config.fs.compendium, compendiumId, datasets[0].file.split('/').pop());
};

fn.saveResult = function(data, compendiumId, fileName) {
    debug('Start saving result for compendium %s under files name %s',
            compendiumId, fileName);
    fileName = fileName.replace(' ', '');
    fileName = fileName.replace('.', '_');
    fileName = fileName.replace(',', '_');
    resultPath = path.join(config.fs.compendium, compendiumId);
    if (!fs.existsSync(resultPath)) {
        fs.mkdirSync(resultPath);
    }
    fileName = path.join(fileName + '.R');
    fn.saveRFile(data, compendiumId, fileName);
    debug('End saving result');
};

fn.saveRFile = function(data, compendiumId, fileName) {
    debug('Start saving file for compendium %s under file name %s',
            compendiumId, fileName);
    let dir = path.join(config.fs.compendium, compendiumId, fileName);
    fs.writeFile(dir, data, 'utf8', function(err) {
        debug(err);
    });
    debug('End saving result under the directory %s', dir);
};

fn.extractCode = function(fileContent, codelines) {
    debug('Start extracting code');
    let newContent = '';
    let splitFileContent = fileContent.split('\n');
    codelines.forEach(function(elem) {
        newContent += splitFileContent[elem] + '\n';
    });
    debug('End extracting code');
    return newContent;
};

fn.extractFigureSize = function (binding, fileContent){
    debug('Start extracting figure width');
    let figureSize = '';
    let splitFileContent = fileContent.split('\n');
    splitFileContent.forEach(function(elem) {
        if ( elem.indexOf("out.width=")>=0 ) {
            debug(elem.split('out.width=')[1].split('}')[0])
            figureSize=elem.split('out.width=')[1].split('}')[0];
        }
    });
    debug(figureSize);
    debug('End extracting figure width');
    return figureSize;
}

fn.extractChunks = function (lines) {
    debug('Start extracting code lines')
    let linesExp = new RegExp('```');
    let start = [], end = [];
    let found = 0;
    for( let codeline = 0; codeline < lines.length; codeline++ ) { 
        if ( linesExp.test(lines[codeline]) ) {
            if ( found % 2 === 0 ) {
                start.push(codeline+1);
                found++;
            } else {
                end.push(codeline);
                found++;
            }
        }
    }
    debug('End extracting code lines')
    return {
        start: start,
        end: end
    };
};

fn.extractCodeFromChunks = function(lines,start,end){
    debug('Start creating code parts')
    let chunksOfCode = [];
    for ( let chunk = 0; chunk < start.length; chunk++) {
        let codeInChunk = lines.slice(start[chunk], end[chunk]);
        if ( end[chunk] != start[chunk+1] + 1 ) {
            for (let j = end[chunk]; j < start[chunk+1]; j++){
                codeInChunk.splice(j,0,'');
            }   
        }
        chunksOfCode.push(codeInChunk);
     }
    // Replace \r through ''
    for( let i = 0; i < chunksOfCode.length; i++) {
        chunksOfCode[i] = chunksOfCode[i].map((x) => x.replace('\r', ''));
    }
    debug('End creating code parts')
    return chunksOfCode;
 };

fn.codeAsJson = function (chunks) {
    debug('Start creating json from code');
    let codeAsJson = [];
    let commentIndicator = /^\s*#.*/;
    let codeLineCounter = 1;

    for ( let chunk = 0; chunk < chunks.length; chunk++ ) {
        chunks[chunk].forEach( codeline => {
            if ( codeline.length > 0 && !commentIndicator.test(codeline) ){
                codeAsJson.push({
                    "code":codeline,
                    "codeblock": chunk + 1, 
                    "codeline": codeLineCounter
                });
                codeLineCounter++;
            }
        });
    }
    debug('End creating json from code')
    return codeAsJson;
};

fn.array2Json = function (array) {
    debug('Start to json')
    let jsonString = JSON.stringify(array);
    let jsonObject = JSON.parse(jsonString);
    debug('End to json')
    return jsonObject;
};

module.exports = fn;

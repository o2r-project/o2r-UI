const rules = require('./rules');
const fn = require('./generalFunctions');
const debug = require('debug')('bindings');

let pJ = {};

pJ.addFileContentToJson = function ( codeAsJson ) {
    debug( 'Start add file content to JSON: %s', JSON.stringify(codeAsJson) )
    //console.log( 'Start add file content to JSON')
    let processedJson = [];
    //console.log(codeAsJson.length)
    for (let codeline = 0; codeline < codeAsJson.length; codeline++) {
        console.log(codeline)
        /*if (codeAsJson[codeline].codeType === 'function') {
            let fun = rules.processFunction(codeAsJson, codeline);
            processedJson.push(fun);
            codeline = fun.end;
            //console.log("func: ",codeline)
        } else if (codeAsJson[codeline].codeType === 'conditional') {
            let conditional = rules.processConditional( codeAsJson, codeline );
            processedJson.push(conditional);
            codeline = conditional.end;
        } else if (codeAsJson[codeline].codeType === 'forLoop' || 
                    codeAsJson[codeline].codeType === 'whileLoop' || 
                    codeAsJson[codeline].codeType === 'repeatLoop') {
            let loop = rules.processLoop( codeAsJson, codeline );
            processedJson.push(loop);
            codeline = loop.end;
        } else if (codeAsJson[codeline].codeType === 'inlineFunction') {
            let inline = rules.processInlineFunction( codeAsJson, codeline );
            processedJson.push( inline );
        } else if ( codeAsJson[codeline].codeType === 'variable' ) {
            let variable = rules.processVariables( codeAsJson, codeline );
            if ( variable.isMultiLinesVariable === false ) {
                processedJson.push( variable );
            } else {
                processedJson.push( variable );
                codeline = variable.end;
            }
            //debug('end of variable call: %s', codeline)
        } else if ( codeAsJson[codeline].codeType === 'variableCall' ) {
            let varCall = rules.processVarCall( codeAsJson, codeline );
            processedJson.push( varCall );
        } else if ( codeAsJson[codeline].codeType === 'library' ) {
            let library = rules.processLibrary( codeAsJson, codeline );
            processedJson.push( library );
        } else if ( codeAsJson[codeline].codeType === 'exFile' ) {
            let exFile = rules.processExFile( codeAsJson, codeline );
            processedJson.push( exFile );
        } else if ( codeAsJson[codeline].codeType === 'sequence' ) {
            let sequence = rules.processSequence( codeAsJson, codeline );
            processedJson.push( sequence );
        }*/
    }
    //console.log(JSON.stringify(processedJson))
    //console.log('End add file content to JSON')
    return processedJson;
};

pJ.getVarsAndValuesOfLines = function (processedJson) {
    debug('Start get vars and values');
    let varsAndValues = [];
    for (let i = 0; i < processedJson.length; i++) {
        if (processedJson[i].json.type == 'function') {
            //console.log('function');
            let start = processedJson[i].index
            let end = processedJson[i].endIndex
            let vars = ['']
            let type = processedJson[i].json.type
            let name = processedJson[i].json.content.name
            let codeBlock = processedJson[i].json.codeBlock
            varsAndValues.push({
                start,
                end,
                vars,
                type,
                name,
                codeBlock
            })

        } else if (processedJson[i].json.type == 'conditional') {
            let start = processedJson[i].json.index
            let end = processedJson[i].endIndex;
            let vars = pJ.getVarsOfCond(processedJson[i].json);
            let type = processedJson[i].json.type
            let name = rules.getContentInBrackets(processedJson[i].json.value)[0]
            let codeBlock = processedJson[i].json.codeBlock
            varsAndValues.push({
                start,
                end,
                vars,
                type,
                name,
                codeBlock
            })

        } else if (processedJson[i].json.type == 'forLoop' || processedJson[i].json.type == 'whileLoop' || processedJson[i].json.type == 'repeatLoop') {
            //console.log('loop');
            let start = processedJson[i].json.index
            let end = processedJson[i].endIndex;
            let vars = pJ.getVarsOfLoops(processedJson[i].json);
            let type = processedJson[i].json.type
            let name = rules.getContentInBrackets(processedJson[i].json.value)[0]
            let codeBlock = processedJson[i].json.codeBlock
            varsAndValues.push({
                start,
                end,
                vars,
                type,
                name,
                codeBlock
            })

        } else if (processedJson[i].json.type == 'inlineFunction') {
            //console.log('ILFunction');
            let start = processedJson[i].index
            let end = processedJson[i].index
            let vars = pJ.getVarsOfInlineFunctions(processedJson[i].json.value)
            let type = processedJson[i].json.type
            let name = processedJson[i].json.call
            let codeBlock = processedJson[i].json.codeBlock
            varsAndValues.push({
                start,
                end,
                vars,
                type,
                name,
                codeBlock
            })
        } else if (processedJson[i].json.type == 'variable') {
            //console.log('var');
            let end;
            let start = processedJson[i].index
            if (processedJson[i].multi == false) {
                end = processedJson[i].index
            } else {
                end = processedJson[i].endIndex;
            }
            let vars = pJ.getVarsOfVariables(processedJson[i].json);
            //console.log('varslog')
            let type = processedJson[i].json.type
            let name = processedJson[i].json.content[0].variable
            let codeBlock = processedJson[i].json.codeBlock
            varsAndValues.push({
                start,
                end,
                vars,
                type,
                name,
                codeBlock
            })

        } else if (processedJson[i].json.type == 'variable call') {
            //console.log('varCall');
            let start = processedJson[i].index
            let end = processedJson[i].index
            let vars = [processedJson[i].json.content.value]
            let type = processedJson[i].json.type
            let name = processedJson[i].json.content.value
            let codeBlock = processedJson[i].json.codeBlock
            varsAndValues.push({
                start,
                end,
                vars,
                type,
                name,
                codeBlock
            })
        } else if (processedJson[i].json.type == 'library') {
            //console.log('lib');
            let start = processedJson[i].index
            let end = processedJson[i].index
            let vars = ['']
            let type = processedJson[i].json.type
            let name = processedJson[i].json.content[0]
            let codeBlock = processedJson[i].json.codeBlock
            varsAndValues.push({
                start,
                end,
                vars,
                type,
                name,
                codeBlock
            })


        } else if (processedJson[i].type == 'exFile') {
            //console.log('exFile');

        } else if (processedJson[i].type == 'sequence') {
            //console.log('seq');

        }
        
    }
    let singleVarsAndValues = getSingleVarsAndValues(varsAndValues);
    //debug('Processed variables ' + JSON.stringify(singleVarsAndValues,null,2));
    debug('End get vars and values: %s');
    return singleVarsAndValues;
    //console.log('VARS ' + JSON.stringify(varsAndValues,null,2));
}

getSingleVarsAndValues = function(varsAndValues){
    let singleVarsAndValues = varsAndValues;
    singleVarsAndValues.forEach((entry,index) => {
        //let entryWithhoutParam = entry.vars.filter(value => !value.includes('='))
        entry.vars.forEach(variable => {
            if(variable.includes('=')){
                let vars = variable.split(/[=|()[\]:]/);
                vars.forEach(singleVar => {
                    let hasNumber = /(?<=[a-zA-Z]+)\d/; 
                    let isOnlyNumber = /\d/
                    if(hasNumber.test(singleVar) == true || isOnlyNumber == false){
                        singleVarsAndValues[index].vars.push(singleVar);
                    }
                })

            }
        })
    })
    return singleVarsAndValues;
}

pJ.getVarsOfInlineFunctions = function (LineWithTypeInlineFunction) {
    let inlineFunVars = "";
    if (LineWithTypeInlineFunction.indexOf('#') == -1) {
        let contentInBrackets = rules.getContentInBrackets(LineWithTypeInlineFunction);
        for (let i = 0; i < contentInBrackets.length; i++) {
            if (isNaN(contentInBrackets[i]) == true) {
                inlineFunVars = contentInBrackets;
            }
        }
    } else {
        let contentString = LineWithTypeInlineFunction;
        let values = contentString.substring(0, indexOf('#'))
        if (values.indexOf('(') != -1 && values.indexOf(')') != -1) {
            let varsInBrackets = rules.getContentInBrackets(values);
            for (let i = 0; i < varsInBrackets.length; i++) {
                if (isNaN(varsInBrackets[i]) == true) {
                    inlineFunVars = varsInBrackets;
                }
            }
        }
    }
    return inlineFunVars;
}

pJ.getVarsOfVariables = function (LineWithTypeVariable) {
    let vars = [];
    for (let i = 0; i < LineWithTypeVariable.content.length; i++) {
        let variable = LineWithTypeVariable.content[i].variable;
        if (variable.indexOf('#') != -1) {
            let varWithoutComment = variable.substring(0, variable.indexOf('#'))
            vars.push(varWithoutComment);
        } else {
            vars.push(variable);
        }
        if (LineWithTypeVariable.content[i].type == 'inlineFunction') {
            let inlineFun = pJ.getVarsOfInlineFunctions(LineWithTypeVariable.content[i].value);
            if (inlineFun.constructor === Array) {
                vars = vars.concat(inlineFun);
            } else {
                vars.push(inlineFun);
            }

        } else {
            let contentString = LineWithTypeVariable.content[i].value;
            if (contentString.indexOf('#') == -1) {
                if (isNaN(contentString) == true) {
                    vars.push(contentString);
                }
            } else {
                let value = contentString.substring(0, contentString.indexOf('#'))
                if (isNaN(value) == true) {
                    vars.push(value);
                }
            }

        }
    }
    return vars;
}
//TODO: Finish cond processing --> Only works for forLoops and variables
pJ.getVarsOfCond = function (LineWithTypeCond) {
    let vars = [];
    let condVar = rules.getContentInBrackets(LineWithTypeCond.value);
    for (let i = 0; i < condVar.length; i++) {
        vars.push(condVar[i]);
    }
    for (let i = 0; i < LineWithTypeCond.content.length; i++) {
        if (LineWithTypeCond.content[i].type == 'variable') {
            let varValue = pJ.getVarsOfVariables(LineWithTypeCond.content[i].value.json);
            vars = vars.concat(varValue);

        } else if (LineWithTypeCond.content[i].type == 'forLoop') {
            let varValue = pJ.getVarsOfLoops(LineWithTypeCond.content[i].value.json, 'forLoop');
            //console.log('varValueLoop');
            //console.log(varValue);
            vars = vars.concat(varValue);
        }
    }
    return vars;
}
//TODO: Extent Loop processing to all, not only vars
pJ.getVarsOfLoops = function (LineWithTypeLoop, loopType) {
    let vars = [];
    if (loopType == 'forLoop') {
        for (let i = 0; i < LineWithTypeLoop.content.length; i++) {
            if (LineWithTypeLoop.content[i].type == 'variable') {
                let varValue = pJ.getVarsOfVariables(LineWithTypeLoop.content[i].value.json);
                vars = vars.concat(varValue);

            }
        }
    }
    return vars;
}

//TODO: Add lines to find all plot functions in script --> not needed for now
pJ.findPlotLines = function (jsonObj, plotFunctions) {
    let plotFunctionsToFind = fn.readFile(plotFunctions);
    let lines = plotFunctionsToFind.split(/\r?\n/);
};




processJsonTypesFromInlineFunction = function (jsonObj) {
    let type = jsonObj.content.type;
    let value = jsonObj.content.args.value;
    for (let i = 0; i < value.length; i++) {
        if (type[i] == 'variable call') {
            if (value[i].indexOf('=') != -1) {
                value = value[i].substring(0, value[i].indexOf('='))
            }
            if (value[i].indexOf('<') != -1) {

            }
            jsonObj.variables = value;
        }
    }
    return jsonObj;
};


pJ.ProcessNestedCont = function (jsonObj) {
    //console.log(allKeys(jsonObj));
    //console.log(JSON.stringify(jsonObj));
    let loopsAndFun = ['forLoop', 'whileLoop', 'repeatLoop', 'conditional', 'function', 'inlineFunction'];

    for (let i = 0; i < jsonObj.Lines.length; i++) {
        if (!loopsAndFun.includes(jsonObj.Lines[i].type)) {
            if (jsonObj.Lines[i].content.value != undefined) {
                processJsonTypeWithoutLoopsAndConds(jsonObj, jsonObj.Lines[i].content.type);
            }
        }
        if (jsonObj.Lines[i].type == 'inlineFunction') {
            if (jsonObj.Lines[i].content.args.value instanceof Object) {
                processJsonTypesFromInlineFunction(jsonObj.Lines[i])
            }
        }
        if (loopsAndFun.includes(jsonObj.Lines[i].type)) {
            //get variables of loops

        }
    }
    return jsonObj;
};

isRegExp = function(regExp){
    try {
          new RegExp('\\b' + regExp + '\\b');
        } catch(e) {
          return false
        }
   return true
}

pJ.backtrackCodelines = function ( allCodeAsJson, backtrackFromTerms, lines, searchForTermsArray ) {
    debug( 'Start backtracking codelines' );
    backtrackFromTerms.forEach( codeTerm => {
        if ( !searchForTermsArray.includes( codeTerm ) ) {
            searchForTermsArray.push( codeTerm );
        }
    });
    let indexOfFunction = 0;
    let codeSubset = '';
    if ( lines.length == 0 ) {
        indexOfFunction = allCodeAsJson.findIndex(fun => fun.vars.every(elem => searchForTermsArray.includes(elem)));
        if ( indexOfFunction != -1 ) {
            codeSubset = allCodeAsJson.slice(0,indexOfFunction + 1);
        } else {
            debug('PlotFunction not found.');
        }
        let plotFunctionComponents = ['lines', 'plot', 'axis', 'mtext', 'legend', 'par'];
        let libraryAndFunction = ['library', 'function'];
        let data = new RegExp('\\b' + 'load' + '\\b');
        codeSubset.forEach( line => {
            if ( plotFunctionComponents.some(fun => line.name.includes(fun)) || 
                                            libraryAndFunction.some(fun => line.type.includes(fun)) || 
                                            line.vars.find(value => data.test(value)) != -1) {
                lines.push({
                    start: line.start,
                    end: line.end,
                    codeBlock: line.codeBlock
                });
                let start = line.start;
                let end = line.end;
                codeSubset = codeSubset.filter(entry => entry.end != end && entry.start != start);
            }
        });
    }
    let search = [];
    backtrackFromTerms.forEach(codeTerm => {
        let removeWhitespaces = codeTerm.replace(/\s/g, "");
        if (removeWhitespaces != "" && isRegExp(removeWhitespaces)) {
            let expression = new RegExp('(?<=^([^"\']|"\'[^"\']*"\')*)' + '\\b' + removeWhitespaces + '\\b');
            if ( !search.includes(expression) ) {
                search.push(expression);
            }
        }
    });
    if ( search.length > 0 ) {
        codeSubset.forEach( line => {
            let value = line.vars.some(rx => search.some(elem => elem.test(rx)));
            if (value) {
                lines.push({
                    start: line.start,
                    end: line.end,
                    codeBlock: line.codeBlock
                });
                if (line.vars.length > 1) {
                    const index = line.vars.findIndex(value => search.some(elem => elem.test(value)));
                    if (index != -1) {
                        line.vars.forEach(elem => {
                            if (!backtrackFromTerms.includes(elem)) {
                                backtrackFromTerms.push(elem);
                            }
                        });
                    }
                }
            }
        });
        varToSearchForNew = backtrackFromTerms.filter((elem) => searchForTermsArray.indexOf(elem) == -1);
        if (varToSearchForNew.length > 0) {
            pJ.backtrackCodelines(codeSubset, varToSearchForNew, lines, searchForTermsArray);
        }
    }

    lines = lines.reduce((noDups, entry) => {
        if (!noDups.some(object => object.start === entry.start && object.end === entry.end)) {
            noDups.push(entry);
        }
        return noDups;
    }, []);
    debug('End backtracking codelines, num of obgjects: %s', lines.length);
    return lines.sort((a, b) => (a.start > b.start) ? 1 : -1);
};


pJ.getCodeLines = function (codelines) {
    let codeLinesOfValues = [];
    let min;
    let max;
    let index = 0;
    let minValue = Number.MAX_SAFE_INTEGER;
    let maxValue = 0;
    let startIndex = 0;

    while (codelines.length > index) {
        //console.log(codeLines[startIndex])
        //console.log(codeLines[index])
        //debug('index: %s', JSON.stringify(codelines[index]))
        //if(codelines[index].end + 1 != codelines[index + 1].start){
            min = codelines[startIndex].start < minValue ? codelines[startIndex].start : minValue;
            max = codelines[index].end > maxValue ? codelines[index].end : maxValue;
            codeLinesOfValues.push({
                start: min,
                end: max
            })
            startIndex = index + 1;
        //} 
        /*if(codelines[index].end + 1 == codelines[codelines.length-1].start) {
            codeLinesOfValues.push({
                start: codelines[index].start,
                end: codelines[codelines.length-1].end
            })
        }*/
        index++;
    }

    /** 
    const min = codeLines.reduce(
        (minValue, codeLine) => (codeLine.start < minValue ? codeLine.start : minValue), Number.MAX_SAFE_INTEGER);
    const max = codeLines.reduce(
        (maxValue, codeLine) => (codeLine.end > maxValue ? codeLine.end : maxValue), 0);

    codeLinesOfValues.push({
        start: min,
        end: max
    })
    */
    return codeLinesOfValues;
}

module.exports = pJ;
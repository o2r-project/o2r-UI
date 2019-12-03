const debug = require('debug')('bindings');

let areYou = {};

const isVariable = function ( code ) {
    const equalitySignDeclaration = /^\s*\b(?![(])[\w\[\],.\s]*\s?=\s?[".\w\[\]]+/;
    const arrowDeclaration = /^\s*\b(?![(])[\w\[\],.\s]*\s?<-\s?[".\w\[\]]+/;
    return !isFunction(code) && 
            (equalitySignDeclaration.test(code) || 
            arrowDeclaration.test(code));
};

const findFunctions = function ( code ) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b|\blibrary\b|\bsource\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;
    if (!isForloop(code) || !isWhileloop(code) || !isRepeatloop(code)) {
        return isFunction.test(code);
    }
};

const isFunction = function (code) {
    return /(?:function)/.test(code);
};

const isInlineFunction = function (code) {
    const isInlineFunction = findFunctions(code);
    return isInlineFunction || /\w+(.)::(.)\w+/.test(code);
};

const isScriptloader = function (code) {
    return /(?:source)/.test(code);
};

const isLibrary = function (code) {
    return /(?:load)/.test(code) || /(?:library)/.test(code);
};

const isForloop = function (code) {
    return /(?:for)/.test(code);
};

const isWhileloop = function (code) {
    return /(?:while)/.test(code);
};

const isRepeatloop = function (code) {
    return /(?:repeat)/.test(code);
};

const isConditional = function (code) {
    return /(?:if)/.test(code);
};

const isSequence = function (code) {
    return /(?<!:):(?!:)/.test(code);
};

const isVariableCall = function (code) {
    const isVariableCall = /^\s*((?![=:(){}]).)*$/;
    const isVariableCall2 = /([\w])_([\w])/;
    return isVariableCall.test(code) || isVariableCall2.test(code);
};

areYou.findType = function (codeline) {
    let codeType = '';
    if (isVariable(codeline)) {
        codeType = 'variable';
    }
    else if (isFunction(codeline)) {
        codeType = 'function';
    }
    else if (isInlineFunction(codeline)) {
        codeType = 'inlineFunction';
    }
    else if (isScriptloader(codeline)) {
        codeType = 'exFile';
    }
    else if (isLibrary(codeline)) {
        codeType = 'library';
    }
    else if (isForloop(codeline)) {
        codeType = 'forLoop';
    }
    else if (isWhileloop(codeline)) {
        codeType = 'whileLoop';
    }
    else if (isRepeatloop(codeline)) {
        codeType = 'repeatLoop';
    }
    else if (isVariableCall(codeline)) {
        codeType = 'variableCall';
    }
    else if (isConditional(codeline)) {
        codeType = 'conditional';
    }
    else if (isSequence(codeline)) {
        codeType = 'sequence';
    } else {
        codeType = '';
    }
    return codeType;
};

areYou.getCodeTypes = function ( codeAsJson ) {
    debug('Start getting code types');
    for ( let codeObject = 0; codeObject < codeAsJson.length; codeObject++ ) {
        let codeType = areYou.findType(codeAsJson[codeObject].code);
        if (codeType !== 'undefined') {
            codeAsJson[codeObject].codeType = codeType;
        } else {
            console.log('Unable to detect type.')
        }
    }
    debug('End getting code types');
    return codeAsJson;
};

processBracketContentLoops = function (brContent, type) {
    let parts = brContent[0].split(' ');
    if (type == 'forLoop') {
        let val = parts[0];
        let sequence = parts[2];
        return {
            val: val,
            sequence: sequence
        };
    } else if (type == 'whileLoop') {
        let val = parts[0];
        let operator = parts[1];
        let sequence = parts[3];
        return {
            val: val,
            operator: operator,
            sequence: sequence
        }
    }
};

processParametersOfInlineFunction = function ( inlineFunctionContent) {
    let parts = [];
    for ( let parameters = 0; parameters < inlineFunctionContent.length; parameters++ ) {
        let content = inlineFunctionContent[parameters].split(',');
        parts.push(content[0]);
    }
    return {
        args: { 'value': parts }
    };
};

//Variables
processVariableCode = function (variableCode) {
    if ( variableCode.indexOf('=') != -1 ) {
        let variableName = variableCode.substring(0, variableCode.indexOf('='));
        let value = variableCode.substring(variableCode.indexOf('=') + 1);
        return {
            variableName: variableName,
            value: value
        };
    } else {
        let variableName = variableCode.substring(0, variableCode.indexOf('<'));
        let value = variableCode.substring(variableCode.indexOf('<') + 2);
        return {
            variableName: variableName,
            value: value
        };
    }
};

processMultiLineVarContent = function (jsonAtVarLine, startIndex) {
    let closingBracket = /[)]/;
    let value = '';
    let end = 0;
    let endIndex;
    let firstOcc = true;
    for (let i = startIndex; i < jsonAtVarLine.length; i++) {
        if (closingBracket.test(jsonAtVarLine[i].value) == true && firstOcc == true) {
            firstOcc = false;
            end = i;
            endIndex = jsonAtVarLine[i].index;
            //console.log('THIS IS THE END ' + end);
            for (let j = startIndex; j <= end; j++) {
                value += jsonAtVarLine[j].value;
                value = value.replace(/ /g, '');
            }
        }
    }
    return {
        value: value,
        end: end,
        endIndex: endIndex 
    };
};
/********************************************************
//InlineFunctions TODO Ready: Yes
//Loops: TODO Ready: Yes
//Variables TODO Ready: Yes
//Functions (Creation not calls) TODO Ready: yes
//conditional (if) TODO Ready: yes
//variable calls TODO Ready: Yes
//lib TODO Ready: yes
//other R files TODO Ready: Yes
//sequence TODO Ready: yes
***********************************************************/

areYou.processFunction = function (fullCode, linenumber) {
    let functionRange = [];
    let code = fullCode[linenumber].code;
    if (code.indexOf('(') != -1 && code.indexOf(')') != -1 || 
        code.indexOf('(') == -1 && code.indexOf(')') == -1) {
        let end = searchEnd(fullCode, fullCode[linenumber].codeline);
        let start = linenumber;
        let functionParameters = areYou.getContentInBrackets(fullCode[linenumber].code);
        let functionName = areYou.getName(fullCode[linenumber].code);
        fullCode[linenumber].content = { 
            'functionParameters': functionParameters,
            'functionName': functionName 
        };
        functionRange.push(start, end.line);
    } else {
        let preprocessMultiLineArgFun = processMultiLineVarContent(fullCode, linenumber);
        let start = linenumber
        let endOfFunArgs = preprocessMultiLineArgFun.end
        let end = searchEnd(fullCode, fullCode[endOfFunArgs].codeline);
        let functionParameters = areYou.getContentInBrackets(preprocessMultiLineArgFun.value);
        let functionName = areYou.getName(preprocessMultiLineArgFun.value);
        fullCode[linenumber].content = { 
            'functionParameters': functionParameters,
            'functionName': functionName 
        };
        let max = 3;
        if (functionRange.length < max) {
            functionRange.push( start, end.line );
        }
    }
    if (functionRange.length > 1) {
        let jsonNew = fullCode.filter( line => line.codeline <= functionRange[0] || 
                                            line.codeline > functionRange[1]);
        fullCode = jsonNew;
    }
    return {
        code:fullCode[linenumber],
        end: functionRange[1]
    }
};

areYou.processLoop = function ( fullCode, linenumber) {
    let end = searchEnd( fullCode, fullCode[linenumber].codeline);
    let start = fullCode[linenumber].codeline;
    addLoopContent( fullCode, linenumber, start, end.line);
    if (fullCode[linenumber].codeType != 'repeatLoop') {
        let brCont = areYou.getContentInBrackets( fullCode[linenumber].code );
        let brContProccessed = processBracketContentLoops(brCont, fullCode[linenumber].codeType);
        brContProccessed.codeType = areYou.findType(brContProccessed.sequence);
        fullCode[linenumber].loopOver = brContProccessed;
    }
    let processedLoop = deleteDups(fullCode, linenumber, end.line);
    return {
        code: processedLoop[linenumber],
        end: end.line,
        endIndex: end.endIndex
    }
};

addLoopContent = function (json,index,startOfLoopLine, endOfLoopIndex) {
    let numOfItems = 0;
    json[index].content = [];

    let endAt = endOfLoopIndex;
    endOfJsonLoop = json.findIndex(item => {
        return item.Line == endAt
    })

    let singleLineTypes = ['variable call','library', 'exFile', 'sequence', 'inlineFunction'];
    let endIndex = 0;
    for (let i = index + 1; i < endOfJsonLoop; i++) {
        
        let line = i;
        let value = json[i].code;
       
        let type = areYou.findType(value);
        
        if (singleLineTypes.includes(type)){
            json[index].content[numOfItems] = { line, value, type };
            numOfItems++;
            endIndex = numOfItems;
        } else {
            value = findValue(json,i);
            json[index].content[numOfItems] = { line, value, type };
            numOfItems++;
            endIndex = value.end
           
        } 
        i = endIndex;
    }
    return json;
};
//TODO: Change also other parts, but it works for INSYDE
findValue = function(json,index){
    //console.log("FindVALue " + JSON.stringify(json[index]))
    if(json[index].codeType == 'function'){
        //console.log('function');
        let fun = areYou.processFunction(json,index);
        return {
            json:fun.json,
            end:fun.end,
            index: json[index].index,
            endIndex:fun.endIndex
        }
    }
    else if(json[index].type == 'conditional'){    
        //console.log('cond in find value');
        let cond = areYou.processConditional(json,index);
       return{
           json:cond.json,
           end:cond.end,
           index: json[index].index,
           endIndex: cond.endIndex
       }
    }
    else if(json[index].codeType == 'forLoop' || json[index].codeType == 'whileLoop' || json[index].codeType == 'repeatLoop'){    
        //console.log('loop');
        let loop = areYou.processLoop(json,index);
        return{
            json:loop.json,
            end:loop.end,
            index: json[index].index,
            endIndex: loop.endIndex

        }
    }
    else if(json[index].type == 'variable'){
        let variable = areYou.processVariables( json, index, false);
        if (variable.multi == false){
            return{
                 json:variable.json,
                 end:index,
                 index: json[index].index
            }
        } else {
            return{
                json:variable.json,
                end:variable.end,
                index: json[index].index,
                endIndex: variable.endIndex
            }
        }
    } else {
        return{
            json:json[index],
            end: index,
            index: json[index].index
        }
    }
};

//ATTENTION: Only works for one neasted loop or cond in this version TODO
findLoopsAndConds = function (json) {
    let forLoopInCond = findNested(json, 'conditional', 'forLoop')
    let CondInForLoop = findNested(json, 'forLoop', 'conditional')
    let loc = 0;

    if (forLoopInCond.location.length > 0) {
        loc = forLoopInCond.location;
    } else if (CondInForLoop.location.length > 0) {
        loc = forLoopInCond.location;
    }
    return loc;
}

findNested = function (json, outerType, innerType) {
    let openingBracketsFound = 0;
    let closingBracketsFound = 0;
    let opening = /{/g;
    let closing = /}/g;
    let location = [];
    let endIndex = [];

    for (let i = 0; i < json.length; i++) {
        if (json[i].type == outerType && json[i].content == undefined) {
            json.forEach(element => {
                if (element.type == innerType) {
                    element.content.forEach(value => {
                        if (opening.test(value.value)) {
                            openingBracketsFound += value.value.match(opening).length;
                            location.push(value.line);
                            endIndex.push(value.index);
                        } else if (closing.test(value.value)) {
                            closingBracketsFound += value.value.match(closing).length;
                            location.push(value.line);
                            endIndex.push(value.index);

                        }
                    });
                }
            });
        }
    }
    return {
        closingBracketsFound: closingBracketsFound,
        openingBracketsFound: openingBracketsFound,
        location: location,
        endIndex:endIndex
    }
}

deleteDups = function (json,index,end) {
    let lineOfLoopContent = [];
        if (json[index].codeType === 'forLoop' || json[index].codeType === 'whileLoop' || json[index].codeType === 'repeatLoop' || json[index].type === 'conditional') {
            if (json[index].content != undefined) {
                let noDuplicateIndex = json.filter(a => a.Line <= end);
                json = noDuplicateIndex;
            }
        }
    //Then delete dublicate items by creating new json
    return json;
};

//TODO Inline functions...
areYou.processInlineFunction = function ( fullCode, linenumber ) {
    let functionParameters = areYou.getContentInBrackets(fullCode[linenumber].code);
    let functionCode = areYou.getFunction(fullCode[linenumber].code);
    let functionParametersProcessed = processParametersOfInlineFunction(functionParameters);
    fullCode[linenumber].call = functionCode;
    fullCode[linenumber].content = [functionParametersProcessed];
    let typeArray = [];
    for (let j = 0; j < functionParametersProcessed.args.value.length; j++) {
        let type = areYou.findType(functionParametersProcessed.args[j]);
        typeArray.push(type);
        functionParametersProcessed.type = typeArray;
    }
    return {
        code:fullCode[linenumber]
    }
};

//TODO: Add brackets to all content
areYou.processVariables = function ( fullCode, linenumber ) {
    let linesOfMultiVar = [];
    let end;
    let endIndexMulti;
    let code = fullCode[linenumber].code;
    //Check whether variable goes over more than one line
    if ( code.indexOf('(') != -1 && code.indexOf(')') != -1 && code.indexOf('%>%') == -1 || 
            code.indexOf('(') == -1 && code.indexOf(')') == -1 && code.indexOf('%>%') == -1 ) {
        let codeProcessed = processVariableCode(code);
        codeProcessed.type = areYou.findType(codeProcessed.value);
        fullCode[linenumber].content = [codeProcessed];
        return {
            code:fullCode[linenumber],
            isMultiLinesVariable:false
        }
    } else {
        let preprocessVarCond = processMultiLineVarContent( fullCode, linenumber);
        let codeProcessed = processVariableCode(preprocessVarCond.value);
        codeProcessed.type = areYou.findType(codeProcessed.value);
        fullCode[linenumber].content = [codeProcessed];
        let start = linenumber + 1;
        end = preprocessVarCond.end;
        endIndexMulti = preprocessVarCond.endIndex;
        linesOfMultiVar.push(start, end);
    }
    //Filter out duplicates
    if ( linesOfMultiVar.length > 0 ) {
        fullCode = fullCode.filter(line => !linesOfMultiVar.includes(line.Line));
        return {
            code:fullCode[linenumber],
            end:end,
            isMultiLinesVariable: true,
            endIndex: endIndexMulti
        }
    }
};

//TODO Cond
areYou.processConditional = function ( fullCode, linenumber) {
    let endLine = searchEnd(fullCode, fullCode[linenumber].codeline);
    let startLine = fullCode[linenumber].codeline;
    addLoopContent(fullCode, linenumber, startLine, endLine.line);
    let processedCond = deleteDups( fullCode, linenumber, endLine.line );
    return {
        code:processedCond[linenumber],
        end:endLine.line,
        endIndex: endLine.endIndex
    }
};

searchEnd = function ( json, lineIndex ) {
    //console.log("lineindex", json[1])
    lineIndex = json.findIndex(a => a.codeline == lineIndex);
    //console.log("lineindex", lineIndex)
    let openCount = 0;
    let closedCount = 0;
    let opening = /{/g;
    let closing = /}/g;
    console.log("li",lineIndex)
    for (let i = lineIndex; i < json.length; i++) {
        //console.log("oc:", openCount)
        //console.log("cc:", closedCount)
        //debug(lineIndex)
        if (opening.test(json[i].code)) {
            openCount += json[i].code.match(opening).length;
        }
        if (closing.test(json[i].code)) {
            closedCount += json[i].code.match(closing).length;
            openCount -= json[i].code.match(closing).length;
        }
        if (openCount === closedCount & openCount != 0 & i == json.length - 1) {
            //console.log("find loops...")
            let loopsAndConds = findLoopsAndConds(json);
            return loopsAndConds;
        }
        if ((openCount === 0) && i != lineIndex) {
            //console.log("end", json[i].codeline)
            return {
                line: json[i].codeline
            }
        }
    }
};

areYou.processVarCall = function ( fullCode, linenumber ) {
    let code = fullCode[linenumber].code;
    fullCode[linenumber].content = { 'code': code };
    return {
        code: fullCode[linenumber]
    };
};

areYou.processLibrary = function ( fullCode, linenumber ) {
    let libraryCall = fullCode[linenumber].code;
    let library = areYou.getContentInBrackets(libraryCall);
    fullCode[linenumber].content = library;
    return {
        code:fullCode[linenumber]
    };
};

areYou.processExFile = function ( fullCode, linenumber ) {
    let code = fullCode[linenumber].code;
    let file = areYou.getContentInBrackets(code)[0];
    fullCode[linenumber].content = file;
    return {
        code:fullCode[linenumber]
    }
};

areYou.processSequence = function ( fullCode, linenumber ) {
    fullCode[linenumber].content = fullCode[linenumber].code;
    return {
        code: fullCode[linenumber]
    }
};

//Helper functions
areYou.getFunction = function (code) {
    return code.substring(0, code.indexOf('('));
};

areYou.getName = function(code){
    if ( code.indexOf('=') != -1 && code.indexOf('(') > code.indexOf('=')) {
        return code.substring(0,code.indexOf('='));
    } else {
        return code.substring(0,code.indexOf('<-'));
    }
}

areYou.getContentInBrackets = function (code) {
    let start = code.indexOf('(');
    let end = code.lastIndexOf(')');
    let innerContent = code.substring(start + 1, end);
    let variables = innerContent.split(',');
    return variables;
};

module.exports = areYou;
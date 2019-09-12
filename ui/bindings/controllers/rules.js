const debug = require('debug')('bindings');

let areYou = {};

const variable = function (content) {
    //Test for variable of form v = x or v <- x
    const isVariable1 = /^\s*\b(?![(])[\w\[\],.\s]*\s?=\s?[".\w\[\]]+/;
    const isVariable2 = /^\s*\b(?![(])[\w\[\],.\s]*\s?<-\s?[".\w\[\]]+/;

    if (!fun(content) && (isVariable1.test(content) || isVariable2.test(content))) {
        return isVariable1;
    }

};

const forloop = function (content) {
    const isForLoop = /(?:for)/;

    if (isForLoop.test(content) == true) {
        return isForLoop;
    }
};

const whileloop = function (content) {
    const isWhileLoop = /(?:while)/;

    if (isWhileLoop.test(content) == true) {
        return isWhileLoop;
    }
};

const repeatloop = function (content) {
    const isRepeatLoop = /(?:repeat)/;

    if (isRepeatLoop.test(content) == true) {
        return isRepeatLoop;
    }
};

const conditional = function (content) {
    const isConditional = /(?:if)/;

    if (isConditional.test(content) == true) {
        return isConditional;
    }
};

const fun = function (content) {
    const isFunction = /(?:function)/;

    if (isFunction.test(content) == true) {
        return isFunction;
    }
};

const lib = function (content) {
    const isLibrary = /(?:library)/;
    const loadData = /(?:load)/

    if (isLibrary.test(content) == true || loadData.test(content) == true) {
        return isLibrary;
    }
};

const loadOtherFile = function (content) {
    const isExFile = /(?:source)/;

    if (isExFile.test(content) == true) {
        return isExFile;
    }
};

const sequence = function (content) {
    const isSequence = /(?<!:):(?!:)/;

    if (isSequence.test(content) == true) {
        return isSequence;
    }
};

const inlineFunction = function (content) {
    const isInlineFunction = findFunctions(content);
    const inlineFunctionFromLibrary = /\w+(.)::(.)\w+/;
    if (isInlineFunction == true || inlineFunctionFromLibrary == true) {
        return isInlineFunction;
    }
};
const variableCall = function (content) {
    const isVariableCall = /^\s*((?![=:(){}]).)*$/;
    const isVariableCall2 = /([\w])_([\w])/;

    if (isVariableCall.test(content) == true || isVariableCall2.test(content) == true) {
        return isVariableCall;
    }
};

areYou.getTypeOfLine = function (lines) {
    for (let i = 0; i < lines.length; i++) {
        let type = areYou.findType(lines[i].value);
        if (type !== 'undefined') {
            lines[i].type = type;
        } else {
            console.log('Unable to detect type.')
        }
    }
    return lines;
};

areYou.findType = function (file) {
    debug('Find Type');
    let type = '';
    if (variable(file)) {
        type = 'variable';
    }
    else if (fun(file)) {
        type = 'function';
    }
    else if (inlineFunction(file)) {
        type = 'inlineFunction';
    }
    else if (loadOtherFile(file)) {
        type = 'exFile';
    }
    else if (lib(file)) {
        type = 'library';
    }
    else if (forloop(file)) {
        type = 'forLoop';
    }
    else if (whileloop(file)) {
        type = 'whileLoop';
    }
    else if (repeatloop(file)) {
        type = 'repeatLoop';
    }
    else if (variableCall(file)) {
        type = 'variable call';
    }
    else if (conditional(file)) {
        type = 'conditional';
    }
    else if (sequence(file)) {
        type = 'sequence';
    } else {
        type = '';

    }
    return type;
};



//Content in Brackets
//Loops
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
processBracketContentInFun = function (funContent) {
    let parts = [];
    for (let i = 0; i < funContent.length; i++) {
        let con = funContent[i].split(',');
        parts.push(con[0]);
    }
    return {
        args: { 'value': parts }
    }
};




//Variables
processVarContent = function (varContent) {
    if (varContent.indexOf('=') != -1 && varContent.indexOf('<-') == -1) {
        let variable = varContent.substring(0, varContent.indexOf('='));
        let value = varContent.substring(varContent.indexOf('=') + 1);
        return {
            variable: variable,
            value: value
        }
    } else {
        let variable = varContent.substring(0, varContent.indexOf('<'));
        let value = varContent.substring(varContent.indexOf('<') + 2);
        return {
            variable: variable,
            value: value
        }
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

areYou.processFunction = function (json,index) {
    let startEnd = [];
    let varCont = json[index].value
    if (varCont.indexOf('(') != -1 && varCont.indexOf(')') != -1 || varCont.indexOf('(') == -1 && varCont.indexOf(')') == -1) {
        let end = searchEnd(json, json[index].codeBlock, json[index].Line);
        let start = index;
        let vars = areYou.getContentInBrackets(json[index].value);
        let name = areYou.getName(json[index].value);
        json[index].content = { 'vars': vars,'name': name };
        startEnd.push(start, end.line,end.endIndex);
    } else {
        let preprocessMultiLineArgFun = processMultiLineVarContent(json, index);
        let start = index
        let endOfFunArgs = preprocessMultiLineArgFun.end
        let end = searchEnd(json, json[index].codeBlock, json[endOfFunArgs].Line);
        let vars = areYou.getContentInBrackets(preprocessMultiLineArgFun.value);
        let name = areYou.getName(preprocessMultiLineArgFun.value);
        json[index].content = { 'vars': vars,'name': name };
        let max = 3;
        if (startEnd.length < max) {
            startEnd.push(start, end.line,end.endIndex);
        }
    }
    if (startEnd.length > 1) {
        let jsonNew = json.filter(line => line.Line <= startEnd[0] || line.Line > startEnd[1]);
        json = jsonNew
    }
    return {
        json:json[index],
        end: startEnd[1],
        index: json[index].index,
        endIndex: startEnd[2]
    }
};
areYou.processLoop = function (json,index) {
    let end = searchEnd(json, json[index].codeBlock, json[index].Line);
    let start = json[index].Line;
    addLoopContent(json,index,start, end.line);
    if (json[index].type != 'repeatLoop') {
        let brCont = areYou.getContentInBrackets(json[index].value, json[index].type);
        let brContProccessed = processBracketContentLoops(brCont, json[index].type);
        brContProccessed.type = areYou.findType(brContProccessed.sequence);
        json[index].loopOver = brContProccessed;
    }
    let processedLoop = deleteDups(json,index,end.line);
    return {
        json:processedLoop[index],
        end:end.line,
        index: json[index].index,
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
        let value = json[i].value;
       
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
    if(json[index].type == 'function'){
        let fun = areYou.processFunction(json,index);
        return {
            json:fun.json,
            end:fun.end,
            index: json[index].index,
            endIndex:fun.endIndex
        }
    }
    else if(json[index].type == 'conditional'){    
        let cond = areYou.processCond(json,index);
       return{
           json:cond.json,
           end:cond.end,
           index: json[index].index,
           endIndex: cond.endIndex
       }
    }
    else if(json[index].type == 'forLoop' || json[index].type == 'whileLoop' || json[index].type == 'repeatLoop'){    
        let loop = areYou.processLoop(json,index);
        return{
            json:loop.json,
            end:loop.end,
            index: json[index].index,
            endIndex: loop.endIndex

        }
    }
    else if(json[index].type == 'variable'){
        let variable = areYou.processVariables(json,index,false);
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
                index: json[index].index
            }
        }
    }
};

searchEnd = function (json, blockIndex, lineIndex) {
    lineIndex = json.findIndex(a => a.Line == lineIndex);
    let openCount = 0;
    let closedCount = 0;
    let opening = /{/g;
    let closing = /}/g;
    for (let i = lineIndex; i < json.length; i++) {
        if (opening.test(json[i].value)) {
            openCount += json[i].value.match(opening).length;
        }
        if (closing.test(json[i].value)) {
            closedCount += json[i].value.match(closing).length;
            openCount -= json[i].value.match(closing).length;
     
        }

        if (openCount == closedCount & openCount != 0 & i == json.length - 1) {
            let loopsAndConds = findLoopsAndConds(json);
            return loopsAndConds;

        }
        if ((openCount == 0) && i != lineIndex) {
            return {
                line:json[i].Line,
                endIndex: json[i].index
            }
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
        if (json[index].type === 'forLoop' || json[index].type === 'whileLoop' || json[index].type === 'repeatLoop' || json[index].type === 'conditional') {
            if (json[index].content != undefined) {
                let noDuplicateIndex = json.filter(a => a.Line <= end);
                json = noDuplicateIndex;
            }
        }
    //Then delete dublicate items by creating new json
    return json;
};

//TODO Inline functions...
areYou.processInlineFunction = function (json,index) {
    let typeArray = [];

    let funCont = areYou.getContentInBrackets(json[index].value);
    let fun = areYou.getFunction(json[index].value);

    let funContProcessed = processBracketContentInFun(funCont);
    json[index].call = fun;
    json[index].content = [funContProcessed];
    typeArray = [];
    for (let j = 0; j < funContProcessed.args.value.length; j++) {
        let type = areYou.findType(funContProcessed.args[j]);
        typeArray.push(type);
        funContProcessed.type = typeArray;
    }
    return {
        json:json[index],
        index: json[index].index
    }
};

//TODO: Add brackets to all content
areYou.processVariables = function (json, index,multi) {
    let linesOfMultiVar = [];
    let end;
    let endIndexMulti;
    let varCont = json[index].value;
    if (varCont.indexOf('(') != -1 && varCont.indexOf(')') != -1 && varCont.indexOf('%>%') == -1 || varCont.indexOf('(') == -1 && varCont.indexOf(')') == -1 && varCont.indexOf('%>%') == -1) {
        let varContProcessed = processVarContent(varCont);
        varContProcessed.type = areYou.findType(varContProcessed.value);
        json[index].content = [varContProcessed];
        return {
            json:json[index],
            multi:false,
            index: json[index].index
        }
    } else {
        let preprocessVarCond = processMultiLineVarContent(json, index);
        let varContProcessed = processVarContent(preprocessVarCond.value);
        varContProcessed.type = areYou.findType(varContProcessed.value);
        json[index].content = [varContProcessed];
        let start = index + 1;
        end = preprocessVarCond.end;
        endIndexMulti = preprocessVarCond.endIndex;
        linesOfMultiVar.push(start, end);
    }
    //Filter out duplicates
    if (linesOfMultiVar.length > 0) {
        json = json.filter(line => !linesOfMultiVar.includes(line.Line));
        linesOfMultiVar = [];
        return {
            json:json[index],
            end:end,
            multi:true,
            endIndex: endIndexMulti
        }
    }
};

//TODO Cond
areYou.processCond = function (json,index) {
    let endLine = searchEnd(json, json[index].codeBlock, json[index].Line);
    let startLine = json[index].Line;

    addLoopContent(json,index,startLine, endLine.line);

    let processedCond = deleteDups(json,index,endLine.line);
    return {
        json:processedCond[index],
        end:endLine.line,
        endIndex: endLine.endIndex
    }
};


areYou.processVarCall = function (json,index) {
    let varCallCont = json[index].value;
    json[index].content = { 'value': varCallCont };

    return {
        json:json[index],
        index: json[index].index
    };
};

areYou.processLib = function (json,index) {
    let libCont = json[index].value;
    let calledLib = areYou.getContentInBrackets(libCont);
    json[index].content = calledLib;
    return {
        json:json[index],
        index: json[index].index
    };
};

areYou.processExFile = function (json,index) {
    let file = json[index].value;
    let LinkToFile = areYou.getContentInBrackets(file)[0];
    json[index].content = LinkToFile;
    return {
        json:json[index],
        index: json[index].index
    }
};

areYou.processSequence = function (json,index) {
    let seq = json[index].value;
    json[index].content = seq;

    return {
        json:json[index],
        index: json[index].index
    }
};

//Helper functions

const findFunctions = function (content) {
    let isFunction = /(?!\bif\b|\bfor\b|\bwhile\b|\brepeat\b|\blibrary\b|\bsource\b)(\b[\w]+\b)[\s\n\r]*(?=\(.*\))/g;

    if (!forloop(content) || !whileloop || !repeatloop) {
        if (isFunction.test(content)) {
            return true;
        }
    }
};

areYou.getFunction = function (content) {
    let fun = content.substring(0, content.indexOf('('));
    return fun;
};

areYou.getName = function(content){
    if(content.indexOf('=') != -1 && content.indexOf('(') > content.indexOf('=')){

        let name = content.substring(0,content.indexOf('='));
        return name
    } else {

        let name = content.substring(0,content.indexOf('<-'));
        return name
    }
}

areYou.getContentInBrackets = function (content) {
    let start = content.indexOf('(');
    let end = content.lastIndexOf(')');
    let innerContent = content.substring(start + 1, end);
    let variables = innerContent.split(',');
    return variables;

};

module.exports = areYou;
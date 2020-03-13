"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var python_parser_1 = require("../python-parser");
var control_flow_1 = require("../control-flow");
describe('ControlFlowGraph', function () {
    function makeCfg() {
        var codeLines = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            codeLines[_i] = arguments[_i];
        }
        var code = codeLines.concat('').join('\n'); // add newlines to end of every line.
        return new control_flow_1.ControlFlowGraph(python_parser_1.parse(code));
    }
    it('builds the right successor structure for try-except', function () {
        var cfg = makeCfg('try:', '    return 0', 'except:', '    return 1');
        var handlerHead = cfg.blocks.filter(function (b) { return b.hint == 'handlers'; }).pop();
        chai_1.expect(cfg.getPredecessors(handlerHead).pop().hint).to.equal('try body');
    });
    it('builds a cfg for a function body', function () {
        var ast = python_parser_1.parse([
            'def foo(n):',
            '    if n < 4:',
            '        return 1',
            '    else:',
            '        return 2'
        ].join('\n'));
        chai_1.expect(ast.code.length).to.be.equal(1);
        chai_1.expect(ast.code[0].type).to.be.equal('def');
        var cfg = new control_flow_1.ControlFlowGraph(ast.code[0]);
        chai_1.expect(cfg.blocks).to.exist;
        chai_1.expect(cfg.blocks.length).to.be.equal(6);
    });
});
//# sourceMappingURL=cfg.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var python_parser_1 = require("../python-parser");
describe('python parser', function () {
    // The next two tests were because the lexer was confused about how to handle dots. It
    // couldn't read a dot followed by digits as a floating point number.
    it('can parse floats that have no digits before the dot', function () {
        python_parser_1.parse('a = .2\n');
    });
    it('can also parse calls on objects', function () {
        python_parser_1.parse('obj.prop\n');
    });
    it('can parse comments', function () {
        var tree = python_parser_1.parse('#\n');
        chai_1.expect(tree.code).to.be.an('array');
        chai_1.expect(tree.code.length).to.equal(0);
    });
    it('can parse scientific notation', function () {
        python_parser_1.parse('1e5\n');
    });
    it('can parse imaginary numbers', function () {
        python_parser_1.parse('x = 12j\n');
    });
    it('can parse lambdas with keyword', function () {
        python_parser_1.parse('f = (lambda document, **variety: document)\n');
    });
    it('parses a dictionary with a `comp_for`', function () {
        var mod = python_parser_1.parse('{k: v for (k, v) in d.items()}\n');
        chai_1.expect(mod).to.exist;
        chai_1.expect(mod.code).to.have.length;
        var node = mod.code[0];
        chai_1.expect(node.entries.length).to.equal(1);
        chai_1.expect(node.comp_for).to.exist;
    });
    it('can parse line continuations', function () {
        python_parser_1.parse(['a = b\\', '.func(1, 2)\\', '.func(3, 4)', ''].join('\n'));
    });
    it('produces the full location of a line for a call statement', function () {
        var node = python_parser_1.parse(['obj.func()', ''].join('\n')).code[0];
        chai_1.expect(node.location).to.deep.equal({
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 10,
        });
    });
    it('does not crash on correct code after parsing bad code', function () {
        chai_1.expect(function () { return python_parser_1.parse('print(1\n'); }).to.throw();
        chai_1.expect(function () { return python_parser_1.parse('a + 1\nb = a\n'); }).not.to.throw();
    });
    it('handles docstrings', function () {
        var node = python_parser_1.parse([
            'def foo():',
            '    """',
            '    this function',
            '    does nothing',
            '    """',
            '    pass\n',
        ].join('\n'));
        chai_1.expect(node).to.exist;
        chai_1.expect(node.code).to.have.length(1);
        chai_1.expect(node.code[0].type).to.equal('def');
        var def = node.code[0];
        chai_1.expect(def.code).to.have.length(2);
        chai_1.expect(def.code[0].type).to.equal('literal');
        chai_1.expect(def.code[1].type).to.equal('pass');
        var docstring = def.code[0];
        chai_1.expect(docstring).to.exist;
        chai_1.expect(docstring.type).to.equal('literal');
    });
});
describe('ast walker', function () {
    it("doesn't crash on try-execpt blocks", function () {
        var tree = python_parser_1.parse(['try:', '    pass', 'except:', '    pass', ''].join('\n'));
        python_parser_1.walk(tree);
    });
    it("doesn't crash on with-statements", function () {
        var tree = python_parser_1.parse(['with sns.axes_style("white"):', '    pass', ''].join('\n'));
        python_parser_1.walk(tree);
    });
});
//# sourceMappingURL=parser.test.js.map
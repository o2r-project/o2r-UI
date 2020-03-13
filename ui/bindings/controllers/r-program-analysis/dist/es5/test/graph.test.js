"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graph_1 = require("../graph");
var chai_1 = require("chai");
describe('graph', function () {
    it('handles empty', function () {
        var g = new graph_1.Graph(function (s) { return s; });
        chai_1.expect(g.nodes).to.exist;
        chai_1.expect(g.nodes.length).eq(0);
    });
    it('tracks nodes', function () {
        var g = new graph_1.Graph(function (s) { return s; });
        g.addEdge('a', 'b');
        g.addEdge('b', 'c');
        var ns = g.nodes;
        chai_1.expect(ns).to.exist;
        chai_1.expect(ns.length).equals(3);
        chai_1.expect(ns).to.include('a');
        chai_1.expect(ns).to.include('b');
        chai_1.expect(ns).to.include('c');
    });
    it('sorts forests', function () {
        var g = new graph_1.Graph(function (s) { return s; });
        g.addEdge('a', 'b');
        g.addEdge('c', 'd');
        var s = g.topoSort();
        chai_1.expect(s).to.exist;
        chai_1.expect(s.length).eq(4);
        chai_1.expect(s).to.include('a');
        chai_1.expect(s).to.include('b');
        chai_1.expect(s).to.include('c');
        chai_1.expect(s).to.include('d');
        // can't say exact order
        chai_1.expect(s.indexOf('a') < s.indexOf('b'), "a before b");
        chai_1.expect(s.indexOf('c') < s.indexOf('d'), "c before d");
    });
    it('sorts dags', function () {
        var g = new graph_1.Graph(function (s) { return s; });
        g.addEdge('a', 'b');
        g.addEdge('b', 'c');
        g.addEdge('a', 'c');
        var s = g.topoSort();
        chai_1.expect(s).to.exist;
        chai_1.expect(s.length).eq(3);
        // must be in this order 
        chai_1.expect(s[0]).eq('a');
        chai_1.expect(s[1]).eq('b');
        chai_1.expect(s[2]).eq('c');
    });
});
//# sourceMappingURL=graph.test.js.map
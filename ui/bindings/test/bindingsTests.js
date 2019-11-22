'use strict';

const bindings = require('../controllers/bindings');

let runRfile = {
    id: 'spacetime',
    result: {
        value: 'figure4runold.R'
    }
};

console.log(__dirname)
bindings.runR(runRfile);
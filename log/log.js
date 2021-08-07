const parser = require('@babel/parser');

const { transformFromAstSync } = require('@babel/core');

const autoTrackPlugin = require('./plugin/index.js');

const path = require('path');

const fs = require('fs');


const sourceCode = fs.readFileSync(path.join(__dirname, './source.js'), 'utf8');
// console.log(sourceCode);
const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous'
});
// console.log(ast);
const {code} = transformFromAstSync(ast, sourceCode, {
    plugins: [[autoTrackPlugin, {
        trackerPath: 'tracker'
    }]]
});
console.log(code);

const parser = require('@babel/parser');

const { transformFromAstSync } = require('@babel/core');

const fs = require('fs');

const path = require('path');

const autoDocPlugin = require('./plugin/index');

const resourceCode = fs.readFileSync(path.join(__dirname, './resource.ts'), 'utf-8');

const ast = parser.parse(resourceCode, {
    sourceType: 'unambiguous',
    plugins: ['typescript']
});

const {code} = transformFromAstSync(ast, resourceCode, {
    plugins: [autoDocPlugin]
})


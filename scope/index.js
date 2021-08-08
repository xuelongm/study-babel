const parser = require('@babel/parser');
const  { transformFromAstSync } = require('@babel/core');
const confuse = require('./plugin/confuse');

const resourceCode = `
    function func() {
        const num1 = 1;
        const num2 = 2;
        const num3 = /*@__PURE__*/add(1, 2);
        const num4 = add(3, 4);
        console.log(num2);
        return num2;
        console.log(num1);
        function add (aaa, bbb) {
            return aaa + bbb;
        }
    }
    func();
`

const ast = parser.parse(resourceCode, {
    sourceType: 'unambiguous'
});

const {code} = transformFromAstSync(ast, resourceCode, {
    plugins: [confuse]
});

console.log(code);

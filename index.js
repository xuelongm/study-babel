const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// const generator = require('@babel/generator');


const code = `
    function name(n) {
        const a = 3;
        return n * n
    }
`;

// console.log(typeof traverse);

const ast = parser.parse(code);
// console.log(JSON.stringify(ast));
traverse(ast, {
    enter(path, state) {
        if (path.node.type === 'Program') {
            state = {a: 12};
        }
        // console.log(path.node.name);
    },
    Identifier(path, state) {
        if (path.node.name === 'name') {
            console.log(state);
        }
    }
})

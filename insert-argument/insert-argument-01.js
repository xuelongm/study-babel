const parser = require('@babel/parser');

const transform = require('@babel/traverse').default;

const generate = require('@babel/generator').default;

const types = require('@babel/types');


const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;

const ast = parser.parse(sourceCode, {
    sourceType:  'unambiguous',
    plugins: ['jsx']
});

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

transform(ast, {

    Program(path) {
        path.traverse({
            CallExpression(path) {
                console.log(12)
            }
        })
    },

    CallExpression(path) {
        const calleeName = generate(path.node.callee);
        if (targetCalleeName.includes(calleeName.code)) {
            const {line, column} = path.node.loc.start;
            path.node.arguments.unshift(types.stringLiteral(`filename (${line} ${column})`));
        }
    }
});

const {code, map} = generate(ast);

// console.log(code);

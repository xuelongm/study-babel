const { declare } = require('@babel/helper-plugin-utils');
const doctrine = require("doctrine");

function resolveType(tsType) {
    const typeAnnotation = tsType && tsType.typeAnnotation;
    if (!typeAnnotation) {
        return null;
    }
    switch (typeAnnotation.type) {
        case 'TSStringKeyword':
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSBooleanKeyword':
            return 'boolean';
        default:
            return 'any';
    }
}

function docResolve(doc) {
    return doctrine.parse(doc, {
        unwrap: true
    });
}

const autoDoc = declare((api, options, dirname) => {
    return {
        pre(file) {
            file.set('docs', []);
        },
        visitor: {
            FunctionDeclaration(path, state) {
                const docs = state.file.get('docs');
                docs.push({
                    type: 'function',
                    name: path.get('id').toString(),
                    params: path.get('params').map(paramPath => {
                        return {
                            name: paramPath.toString(),
                            type: resolveType(paramPath.getTypeAnnotation())
                        }

                    }),
                    return: resolveType(path.get('returnType').getTypeAnnotation()),
                    doc: path.node.leadingComments && docResolve(path.node.leadingComments[0].value)
                })
            }
        },
        post(file) {
            const docs = file.get('docs');
            console.log(JSON.stringify(docs))
        }
    }
});

module.exports = autoDoc;
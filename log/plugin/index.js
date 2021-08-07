
const { declare } = require('@babel/helper-plugin-utils');
const importModule = require('@babel/helper-module-imports');

const autoTrackPlugin = declare((api, options, dirname) => {
    api.assertVersion(7);
    return {
        visitor: {
            Program: {
                enter(path, state) {
                    path.traverse({
                        ImportDeclaration(currentPath) {
                            const requirePath = currentPath.node.source.value;
                            if (requirePath === options.trackerPath) {
                                const specifierPath = curPath.get('specifiers.0');
                                state.trackerImportId =  specifierPath.get('local').toString()
                            }
                        }
                    });
                    if (!state.trackerImportId) {
                        state.trackerImportId  = importModule.addDefault(path, 'tracker',{
                            nameHint: path.scope.generateUid('tracker')
                        }).name;
                    }
                    state.trackerAST = api.template.statement(`${state.trackerImportId}()`)();
                }
                
            },
            'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
                const bodyPath = path.get('body');
                if (bodyPath.isBlockStatement()) {
                    bodyPath.node.body.unshift(state.trackerAST);
                } else {
                    const ast = api.template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({PREV_BODY: bodyPath.node});
                    bodyPath.replaceWith(ast);
                }
            }
        },
        
    }
});

module.exports = autoTrackPlugin;
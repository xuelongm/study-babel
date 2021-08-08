const {declare} = require('@babel/helper-plugin-utils');

const base54 = (function(){
    var DIGITS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
    return function(num) {
            var ret = "";
            do {
                    ret = DIGITS.charAt(num % 54) + ret;
                    num = Math.floor(num / 54);
            } while (num > 0);
            return ret;
    };
})();

const confuse = declare((api, options, dirname) =>  {
    api.assertVersion(7);
    return {
        pre(file) {
            file.set('uid', 0);
        },
        visitor: {
            Scopable: {
                exit(path, state) {
                    let uid = state.file.get('uid');
                    Object.entries(path.scope.bindings).flatMap(([key, binding]) => {
                        if (binding.isDealed) return;
                        binding.isDealed = true;
                        const newName = path.scope.generateUid(base54(uid++));
                        path.scope.rename(key, newName);
                    });
                }
            }
        }
    }
});

module.exports = confuse;
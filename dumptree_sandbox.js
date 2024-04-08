var code=`
delete process
function buildObjectTree(obj, depth = 0, path = []) {
    const MAX_DEPTH = 7;
    if (depth > MAX_DEPTH) {
        return { note: 'Maximum depth reached' };
    }
    if (path.includes(obj)) {
        return { note: 'Circular reference detected' };
    }

    const tree = {};
    Object.getOwnPropertyNames(obj).forEach(prop => {
        try {
            const property = obj[prop];
            // 尝试转换属性值为字符串
            let propertyStr;
            try {
                propertyStr = JSON.stringify(property);
                if (propertyStr === undefined) {
                    // 对于某些类型，如函数，JSON.stringify 返回 undefined
                    propertyStr = property.toString();
                }
            } catch (error) {
                propertyStr = 'Cannot convert to string';
            }

            if (typeof property === 'object' && property !== null && !(property instanceof Array)) {
                if (prop === 'global' && depth > 0) {
                    tree[prop] = { type: 'object', value: 'Global Object', str: 'Global Object' };
                } else {
                    tree[prop] = buildObjectTree(property, depth + 1, [...path, obj]);
                }
            } else {
                tree[prop] = { 
                    type: typeof property, 
                    value: typeof property === 'function' ? 'Function' : property, 
                    str: propertyStr 
                };
            }
        } catch (error) {
            tree[prop] = { type: 'error', value: error.message, str: 'Error' };
        }
    });

    return tree;
}

const rootObjects = {
    //global: global,
    //this: this,
    //ObjectConstructor: Object.constructor,
    Constructor: constructor,
    Object: Object,
    Array: Array,
    Function: Function,
    ArrowFunction: () => {},
    AsyncFunction: async () => {},
    AsyncArrowFunction: async () => {},
};

const objectTrees = {};
for (const key in rootObjects) {
    objectTrees[key] = buildObjectTree(rootObjects[key], 0, []);
}

const jsonResult = JSON.stringify(objectTrees, null, 2);
console.log(jsonResult);
`
var {jevalx} = require('./jevalx');
(async()=>{
  await jevalx(code,{console:console});
})()

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
            let propertyStr;
            try {
                propertyStr = JSON.stringify(property);
                if (propertyStr === undefined) {
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
    const proto = Object.getPrototypeOf(obj);
    if (proto) {
        tree['getPrototypeOf'] = buildObjectTree(proto, depth + 1, [...path, obj]);
    }
    if (obj.__proto__) {
        tree['__proto__'] = buildObjectTree(proto, depth + 1, [...path, obj]);
    }

    return tree;
}

const rootObjects = {
    _Constructor: constructor,
    _Object: Object,
    _Array: Array,
    _Function: Function,
    _ArrowFunction: () => {},
    _AsyncFunction: async () => {},
    _AsyncArrowFunction: async () => {},
    _Promise: (async () => {}),
};

const objectTrees = {};
for (const key in rootObjects) {
    objectTrees[key] = buildObjectTree(rootObjects[key], 0, []);
}

const jsonResult = JSON.stringify(objectTrees, null, 2);
console.log(jsonResult);


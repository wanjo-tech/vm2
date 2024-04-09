process.on('unhandledRejection', (reason, promise) => {
  console.error('!!!! WARNING unhandledRejection', promise, 'reason:', reason);
});

var {jevalx,S_SETUP} = require('./jevalx');

const console_log=console.log,Object_getPrototypeOf=Object.getPrototypeOf,Object_getOwnPropertyNames=Object.getOwnPropertyNames,Object_setPrototypeOf=Object.setPrototypeOf,Object_getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor;

eval(S_SETUP);

//if (constructor==Object) Object_setPrototypeOf(constructor,null);

if (Object.__proto__ && constructor.__proto__ && Object.__proto__.constructor!=constructor.__proto__.constructor){
  console_log('test constructor.__proto__.constructor');
  constructor.__proto__.constructor=Object.__proto__.constructor;
}
const Object_tocheck = Object;

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
        const descriptor = Object_getOwnPropertyDescriptor(obj, prop);
        let propertyStr = 'Uninitialized';
        let danger = undefined;
        if (descriptor) {
            if (descriptor.get) {
                propertyStr = 'Getter function';
                danger = true; // 
            } else if (descriptor.value) {
                try {
                    const property = descriptor.value;
                    propertyStr = JSON.stringify(property) || property.toString();
                    if (propertyStr.indexOf('Object(') >= 0) danger = true;
                } catch (error) {
                    propertyStr = 'Cannot convert to string';
                }
            }
        }
        try {
            const property = obj[prop];
            let propertyStr;
            let danger = undefined;
            try {
                propertyStr = JSON.stringify(property);
                if (propertyStr === undefined) {
                    propertyStr = property.toString();
                }
                if (propertyStr.indexOf('Object')>=0) danger=true;
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
                    str: propertyStr ,
                    danger,
                };
            }
            if (prop=='constructor'){
              if (property==Object_tocheck){
                tree[prop]['danger'] = true;
              }
            }
        } catch (error) {
            tree[prop] = { type: 'error', value: error.message, str: 'Error' };
        }
    });
    const proto = Object_getPrototypeOf(obj);
    if (proto) {
        tree['getPrototypeOf()'] = buildObjectTree(proto, depth + 1, [...path, obj]);
    }
    if (obj.__proto__) {
        tree['proto()'] = buildObjectTree(obj.__proto__, depth + 1, [...path, obj]);
    }

    return tree;
}

const rootObjects = {
    _Constructor: constructor,
    _Object: Object,
    _Array: Array,
    _Function: (()=>_).constructor,
    _AsyncFunction: async () => {},
    _Promise: (async () => {}),
};

const objectTrees = {};
for (const key in rootObjects) {
    objectTrees[key] = buildObjectTree(rootObjects[key], 0, []);
}

const jsonResult = JSON.stringify(objectTrees, null, 2);
console_log(jsonResult);


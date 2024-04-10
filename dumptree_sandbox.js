process.on('unhandledRejection', (reason, promise) => {
  console.error('!!!! WARNING unhandledRejection', promise, 'reason:', reason);
});

var {jevalx,S_SETUP} = require('./jevalx');

const console_log=console.log,Object_getPrototypeOf=Object.getPrototypeOf,Object_getOwnPropertyNames=Object.getOwnPropertyNames,Object_setPrototypeOf=Object.setPrototypeOf,Object_getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor,getOwnPropertyNames = Object_getOwnPropertyNames;

var code=`

if (constructor && Object && Object.__proto__ && constructor.__proto__ && Object.__proto__.constructor!=constructor.__proto__.constructor){
  console_log('test constructor.__proto__.constructor');
  constructor.__proto__.constructor=Object.__proto__.constructor;
}
//if (constructor==Object)
//Object_setPrototypeOf(constructor, null);

const property_tocheck = [Object];

function buildObjectTree(obj, depth = 0, path = []) {
    const MAX_DEPTH = 7;
    if (depth > MAX_DEPTH) {
        return { note: 'Maximum depth reached' };
    }
    if (path.includes(obj)) {
        return { note: 'Circular reference detected' };
    }

  if (obj!==null && obj!==undefined) {
    const tree = {typeobj:typeof(obj)};
    getOwnPropertyNames(obj).forEach(prop => {
        const descriptor = Object_getOwnPropertyDescriptor(obj, prop);
        let propertyStr = 'Uninitialized';
        let danger = undefined;
        if (descriptor) {
            if (descriptor.get) {
                propertyStr = 'Getter function';
                danger = 3; // 
            } else if (descriptor.value) {
                try {
                    const property = descriptor.value;
                    propertyStr = JSON.stringify(property) || property.toString();
                    if (propertyStr.indexOf('Object(') >= 0) danger = 4;
                } catch (error) {
                    propertyStr = 'Cannot convert to string';
                }
            }
        }
        try {
            const property = obj[prop];
            let propertyStr;
            try {
                propertyStr = JSON.stringify(property);
                if (propertyStr === undefined) {
                    propertyStr = property.toString();
                }
                if (propertyStr.indexOf('Object')>=0) danger=1;
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
              if (property_tocheck.indexOf(property_tocheck)>=0){
                tree[prop]['danger'] = 2;
              }
            }
        } catch (error) {
            tree[prop] = { type: 'error', value: error.message, str: 'Error' };
        }
    });
    const proto = Object_getPrototypeOf(obj);
    if (proto) {
        tree['prototype_'] = buildObjectTree(proto, depth + 1, [...path, obj]);
    }
    if (proto !== obj.__proto__ && obj.__proto__) {
        tree['__proto'] = buildObjectTree(obj.__proto__, depth + 1, [...path, obj]);
    }
    return tree;
  }
}

const rootObjects = {
    _Constructor: constructor,
    root_Object: Object,
    root_Array: Array,
    root_Function: (()=>_).constructor,
    root_AsyncFunction: async () => {},
    root_Promise: (async () => {}),
};

const objectTrees = {};
for (const key in rootObjects) {
    objectTrees[key] = buildObjectTree(rootObjects[key], 0, []);
}

const jsonResult = JSON.stringify(objectTrees, null, 2);
console_log(jsonResult);
`;

(async()=>{
  await jevalx(`console_log('[')`,{console_log});
  await jevalx(code,{console_log,getOwnPropertyNames,Object_getPrototypeOf,Object_setPrototypeOf,Object_getOwnPropertyDescriptor});
  await jevalx(`console_log(']')`,{console_log});
})()

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf=Object.getPrototypeOf;
const Object_setPrototypeOf=Object.setPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;

const property_tocheck = [Object];

function buildObjectTree(obj, depth = 0, patha = [], pathb=[]) {
    const MAX_DEPTH = 7;
    if (depth > MAX_DEPTH) {
        return { note: 'Maximum depth reached' };
    }
    if (patha.includes(obj)) {
        return { note: 'Circular reference detected' };
    }

  if (obj!==null && obj!==undefined) {
    const tree = {typeobj:typeof(obj)};
    Object_getOwnPropertyNames(obj).forEach(prop => {
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
                    if (propertyStr.indexOf('Object(') >= 0) {
		    	if (property != Object) danger = 1;
		    }
                    if (propertyStr.indexOf(' Function(') >= 0) {
		    	if (property != Function) danger = 2;
		    }
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
                if (propertyStr.indexOf('Object')>=0) {
			if (property != Object && typeof property!='string') danger=5;
			//else danger=0;
		}
                if (propertyStr.indexOf(' Function')>=0) {
			if (property != Function) danger=6;
			//else danger=0;
		}
            } catch (error) {
                propertyStr = 'Cannot convert to string';
            }

            if (typeof property === 'object' && property !== null && !(property instanceof Array)) {
                if (prop === 'global' && depth > 0) {
                    tree[prop] = { type: 'object', value: 'Global Object', str: 'Global Object' };
                } else {
                    tree[prop] = buildObjectTree(property, depth + 1, [...patha, obj],[...pathb,prop]);
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
        tree[prop]['pathb'] = [...pathb,prop].join('.');
    });
    const proto = Object_getPrototypeOf(obj);
    if (proto) {
        tree['prototype_'] = buildObjectTree(proto, depth + 1, [...patha, obj],[...pathb,'getPrototypeOf()']);
    }
    if (proto !== obj.__proto__ && obj.__proto__) {
        tree['__proto'] = buildObjectTree(obj.__proto__, depth + 1, [...patha, obj],[...pathb,'__proto__']);
    }
    return tree;
  }
}

const rootObjects = {
    constructor: constructor,
    Object: Object,
    Array: Array,
    Function: (()=>_).constructor,
    AsyncFunction: async () => {},
    Promise: (async () => {}),
    //HostPromise: import('').catch(_=>_).constructor,//
};

if (require.main === module) {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('!!!! WARNING unhandledRejection', promise, 'reason:', reason);
  });

  var {jevalx,S_SETUP} = require('./jevalx');

  eval(S_SETUP);

  if (constructor && Object && Object.__proto__ && constructor.__proto__ && Object.__proto__.constructor!=constructor.__proto__.constructor){
    console.log('test constructor.__proto__.constructor');
    constructor.__proto__.constructor=Object.__proto__.constructor;
  }
  //if (constructor==Object)
  //Object_setPrototypeOf(constructor, null);

  const objectTrees = {};
  for (const key in rootObjects) {
      objectTrees[key] = buildObjectTree(rootObjects[key], 0, [],[key]);
  }
  const jsonResult = JSON.stringify(objectTrees, null, 2);
  console.log(jsonResult);
}else{
  module.exports = (o)=>buildObjectTree(o,0,[])
}

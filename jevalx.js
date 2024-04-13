const vm = require('node:vm');
const processWtf = require('process');

//boost:
const console_log = console.log;
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
const getOwnPropertyNames = Object_getOwnPropertyNames;
const Object_assign = Object.assign;

const delay = (t,rt)=>new Promise((r,j)=>setTimeout(()=>r(rt),t));

// for __proto__ Pollultion:
function findEvil(obj,maxdepth=3) {
  let currentObj = obj;
  let depth = 0;
  while (currentObj !== null && currentObj!==undefined && depth < maxdepth) {
    //'constructor','toString','__proto__',
    const properties = ['constructor','then'];//Object_getOwnPropertyNames(currentObj);
    for (let i = 0; i < properties.length; i++) {
      const descriptor = Object_getOwnPropertyDescriptor(currentObj, properties[i]);
      if (descriptor && (typeof descriptor.get === 'function' || typeof descriptor.set == 'function')) {
        return true;
      }
    }
    currentObj = Object_getPrototypeOf(currentObj);
    depth++;
  }
  return false;
}

// for Promise Pollultion:
const Promise___proto__ = Promise.__proto__;
const Promise___proto___apply = Promise.__proto__.apply;
const Promise___proto___then = Promise.__proto__.then;
const Promise_prototype_finally = Promise.prototype.finally;
const Promise_prototype_catch = Promise.prototype.catch;
const Promise_prototype_then = Promise.prototype.then;

const Promise_getPrototypeOf = Object.getPrototypeOf(Promise);
Object.setPrototypeOf(Promise,null);///protect Host Promise

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

//const S_FUNCTION = "(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";

function ObjectX(){ if (this instanceof ObjectX){ }else{ return new ObjectX() } }
ObjectX.prototype.constructor = ObjectX;
Object.setPrototypeOf(ObjectX.prototype,null);
Object.freeze(ObjectX.prototype);
Object.setPrototypeOf(ObjectX.__proto__,null);
Object.setPrototypeOf(ObjectX,null);
Object.freeze(ObjectX);

const S_SETUP = [
  'console','Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'
].map(v=>'delete '+v+';').join('')
//IMPORTANT: still need to lock the danger functions of 'this'
+[
//  '__defineGetter__',
//  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
].map(v=>'Object.setPrototypeOf('+v+',null);Object.freeze('+v+');delete constructor.'+v+';').join('')
+`
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}
//for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames','getPrototypeOf'].indexOf(k)<0){delete Object[k]}}

//TOOLS
//AsyncFunction = (async()=>{}).constuctor;
//for debug:
//function getAllPrototypeMethods(obj) {
//    let props = [];
//    let currentObj = obj;
//    do {
//        props = props.concat(Object.getOwnPropertyNames(currentObj));
//    } while ((currentObj = Object.getPrototypeOf(currentObj)));
//
//    return props.sort().filter(function(e, i, arr) { 
//       if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
//    });
//}
//console.log(getAllPrototypeMethods(constructor));

Promise
`;

//tmp for __proto__ attach, clean later..
let sandbox_safe_method = function(m,do_return=false){
  let rt = function(...args){ let rt = m(...args); if (do_return) return rt }
  Object.setPrototypeOf(rt,null);
  Object.freeze(rt);
  //console.log('sandbox_safe_method',rt);
  return rt;
};

let jevalx_core = async(js,ctx,timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js);
  let last_resolve,last_reject;//for quicker return.
    let tmpHandlerReject = (ex, promise)=>{ if (!err) err={message:'EvilXb',js};
      //err.message!='EvilXb' &&
      console.log('EvilXb=>',ex,'<=',jss)
      if (last_reject) last_reject(err);
    };
    let tmpHandlerException = (ex, promise)=>{ if (!err) err={message:'EvilXa',js};
      //err.message!='EvilXa' &&
      console.log('EvilXa=>',ex,'<=',jss)
      if (last_reject) last_reject(err);
    };
  try{
    processWtf.addListener('unhandledRejection',tmpHandlerReject);
    processWtf.addListener('uncaughtException',tmpHandlerException)
    let _Promise;
    //support the user_import_handler()
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      if (!evil && !err){
        if (user_import_handler) { return user_import_handler({specifier, referrer, importAttributes}) }
        if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
      }
      evil++; err = {message:'EvilImport',js};
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      last_resolve = r, last_reject = j;
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV TEST...
      try{
        //GENESIS
        //ctxx = vm.createContext(new function(){});//BIGBANG
        ctxx = vm.createContext(new ObjectX);//BIGBANG
        [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);//INIT
        //ctxx.console = {log:console.log,props:getOwnPropertyNames};//DEV
        let console_dev = Object.create(null);
        console_dev['log']=sandbox_safe_method(console.log);
        ctxx.console = console_dev;
        if (ctx) Object_assign(ctxx,ctx);//CTX: TODO, need to protect the outer stuff for the __proto__ pollution.

        //PRECAUTION
        //Promise.prototype.catch = function(){
        //  return new _Promise((rr,jj)=>{ Promise_prototype_catch.call(this,error=>jj(error))});
        //};
        //TO IMPROVE LATER:
        Object.setPrototypeOf(Promise.prototype.catch,null);
        Object.freeze(Promise.prototype.catch);
        Object.setPrototypeOf(Promise.prototype.finally,null);
        Object.freeze(Promise.prototype.finally);
        Object.setPrototypeOf(Promise.prototype.then,null);
        Object.freeze(Promise.prototype.then);
        //Object.setPrototypeOf(Promise.prototype.constructor,null);
        Promise.prototype.constructor=ObjectX;//...
        Object.setPrototypeOf(Promise.prototype,null);
        Object.freeze(Promise.prototype);

        //SIMULATION{{{
        [ctxx,rst] = jevalx_raw(`(async()=>{let rst=(()=>eval(${jss}))();while(rst){if(rst instanceof Promise){rst=await rst}else if(typeof rst=='function'){rst=rst()}else break}return ${!!json_output}?JSON.stringify(rst):rst})()`,ctxx,timeout,js_opts);
        //SIMULATION}}}

        //HOUSEWEEP
        rst = await rst;
        if (rst) {
          Object.setPrototypeOf(rst,null);//clear the potential proto-attack
          if (findEvil(rst)) throw {message:'EvilProtoX',js};
          delete rst['toString']; delete rst['constructor']; delete rst['toJSON'];//...maybe no need anymore? TODO
        }
      }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js};
        //err.message=='EvilXc' &&
        console.log('EvilXc=>',ex,'<=',jss)
      }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilXd',js};
    //err.message=='EvilXd' &&
    console.log('EvilXd=>',ex,'<=',jss)
  }
  finally{
    Object.setPrototypeOf(Promise,Promise_getPrototypeOf);
    Promise.prototype.catch = Promise.prototype.catch;//
    Promise.prototype.then = Promise_prototype_then;//
    Promise.prototype.finally = Promise_prototype_finally;//
    //Promise.prototype.constructor = Promise;
    if (Promise.__proto__){
      Promise.__proto__.constructor=Function;
    }
    Object.prototype.constructor=Object;
    processWtf.removeListener('unhandledRejection',tmpHandlerReject);
    processWtf.removeListener('uncaughtException',tmpHandlerException)
  }
  if (evil || err) throw err;
  if (return_ctx) return [ctxx,rst];
  return rst;
}
let jevalx = jevalx_core;

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,delay,ObjectX}


const vm = require('node:vm');
const processWtf = require('process');

//boost:
const console_log = console.log;
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
const getOwnPropertyNames = Object_getOwnPropertyNames;
const Object_assign = Object.assign;

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
const Promise_prototype_catch = Promise.prototype.catch;
const Promise_getPrototypeOf = Object_getPrototypeOf(Promise);

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

//const S_FUNCTION = "(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";

const S_SETUP = [
  'console','Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'
].map(v=>'delete '+v+';').join('')+`
delete constructor.__proto__.__proto__.constructor;
delete constructor.__proto__.__proto__.__defineGetter__;
delete constructor.__proto__.__proto__.__defineSetter__;
delete constructor.__proto__.constructor;
Object.setPrototypeOf(constructor,null);
Object.freeze(constructor);
Object.setPrototypeOf(toString,null);
Object.freeze(Function.__proto__);
//Object.freeze(Function);
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}
Promise
`;

let jevalx_core = async(js,ctx,timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js);
  let tmpHandlerReject = (ex, promise)=>{ if (!err) err={message:'EvilXb',js};
    err.message!='EvilXb' && console.log('EvilXb=>',ex,'<=',jss)
  };
  let tmpHandlerException = (ex, promise)=>{ if (!err) err={message:'EvilXa',js};
    err.message!='EvilXa' && console.log('EvilXa=>',ex,'<=',jss)
  };
  try{
    processWtf.addListener('unhandledRejection',tmpHandlerReject);
    processWtf.addListener('uncaughtException',tmpHandlerException)
    //support the user_import_handler()
    let _Promise;
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      if (!evil && !err){
        if (user_import_handler) { return user_import_handler({specifier, referrer, importAttributes}) }
        if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
      }
      evil++; err = {message:'EvilImport',js};
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV TEST...
      try{
        //GENESIS
        ctxx = vm.createContext(new function(){});//BIGBANG
        [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);//INIT
        ctxx.console = {log:console.log,props:getOwnPropertyNames};//DEV
        ctxx.setTimeout= setTimeout;//DEV
        if (ctx) Object_assign(ctxx,ctx);//CTX
        //OVERRIDE
        Promise.prototype.catch = function(){
          return new _Promise((r,j)=>{ Promise_prototype_catch.call(this,error=>j(error))});
        };
        //WORLD
        [ctxx,rst] = jevalx_raw(js,ctxx,timeout,js_opts);
        let sandbox_level = 9;
        for (var i=0;i<sandbox_level;i++) {
          //console_log('debug',i,rst);
          if (evil || !rst || err) break;
          //if (findEvil(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {//run in the sandbox !
            ctxx['rst']=rst;
            [ctxx,rst] = jevalx_raw('(()=>rst())()',ctxx,timeout,js_opts);
          }else if (rst.then){
            rst = await new Promise(async(r,j)=>{
              setTimeout(()=>j({message:'Timeout',js}),timeout);
              try{ r(await rst) } catch(ex) { j(ex) };
            });
          } else break;
        }
        if (rst) {
          if (json_output){
            ctxx['rst'] = rst;
            rst = jevalx_raw('JSON.stringify(rst==this?{}:rst)',ctxx,timeout,js_opts)[1]; //do inside...
            rst = JSON.parse(rst);
          }else{
            if (findEvil(rst)) throw {message:'EvilProtoX',js};
            //delete rst['toString']; //delete rst['__proto__']; //delete rst['constructor'];
          }
        }
      }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js};
        err.message=='EvilXc' && console.log('EvilXc=>',ex,'<=',jss)
      }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilXd',js};
    err.message=='EvilXd' && console.log('EvilXd=>',ex,'<=',jss)
  }
  finally{
    Object.setPrototypeOf(Promise,Promise_getPrototypeOf);
    Promise.__proto__.constructor=Function;
    Object.prototype.constructor=Object;
    processWtf.removeListener('unhandledRejection',tmpHandlerReject);
    processWtf.removeListener('uncaughtException',tmpHandlerException)
  }
  if (evil || err) throw err;
  if (return_ctx) return [ctxx,rst];
  return rst;
}
var jevalx = jevalx_core;
let jevalx_dev = async(js,ctx,timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js);
  let tmpHandlerReject = (ex, promise)=>{ if (!err) err={message:'EvilXb',js};
    //err.message!='EvilXb' &&
    console.log('EvilXb=>',ex,'<=',jss)
  };
  let tmpHandlerException = (ex, promise)=>{ if (!err) err={message:'EvilXa',js};
    err.message!='EvilXa' && console.log('EvilXa=>',ex,'<=',jss)
  };
  try{
    processWtf.addListener('unhandledRejection',tmpHandlerReject);
    processWtf.addListener('uncaughtException',tmpHandlerException)
    //support the user_import_handler()
    let _Promise;
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      if (!evil && !err){
        if (user_import_handler) { return user_import_handler({specifier, referrer, importAttributes}) }
        if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
      }
      evil++; err = {message:'EvilImport',js};
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV TEST...
      try{
        //GENESIS
        ctxx = vm.createContext(new function(){});//BIGBANG
        [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);//INIT
        ctxx.console = {log:console.log,props:getOwnPropertyNames};//DEV
        ctxx.setTimeout= setTimeout;//DEV
        if (ctx) Object_assign(ctxx,ctx);//CTX
        //PROTECT Host Promise
        Promise.prototype.catch = function(){ return new _Promise((r,j)=>{ Promise_prototype_catch.call(this,error=>j(error))}); };
        //WORLD
        [ctxx,rst] = await jevalx_raw(`new Promise(async(resolve,reject)=>{ try{ var rst = eval(${jss}); for (let i=0;i<9;i++){ if (!rst) break; if (rst instanceof Promise) { setTimeout(()=>reject('EvilLoop'),${timeout}); rst = await rst; } else if (typeof rst=='function') rst = await rst(); else break; } if (rst instanceof Promise) { return reject('EvilLoopX'); } resolve( ${json_output}?JSON.stringify(rst):rst); }catch(ex){ reject(ex) } })`,ctxx,timeout,js_opts);
      }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js};
        err.message=='EvilXc' && console.log('EvilXc=>',ex,'<=',jss)
      }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilXd',js};
    err.message=='EvilXd' && console.log('EvilXd=>',ex,'<=',jss)
  }
  finally{
    Object.setPrototypeOf(Promise,Promise_getPrototypeOf);
    Promise.__proto__.constructor=Function;
    Object.prototype.constructor=Object;
    processWtf.removeListener('unhandledRejection',tmpHandlerReject);
    processWtf.removeListener('uncaughtException',tmpHandlerException)
  }
  if (evil || err) throw err;
  if (return_ctx) return [ctxx,rst];
  return rst;
}


if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,jevalx_dev}


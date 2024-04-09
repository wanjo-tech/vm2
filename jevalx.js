const vm = require('node:vm');
const console_log = console.log;

const Promise___proto___apply = Promise.__proto__.apply;
const Promise___proto___catch = Promise.__proto__.catch;
const Promise___proto___then = Promise.__proto__.then;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
const Object_assign = Object.assign;

function findEvilGetter(obj,maxdepth=3) {
  let currentObj = obj;
  let depth = 0;
  while (currentObj !== null && depth < maxdepth) {
    const properties = ['then'];//Object_getOwnPropertyNames(currentObj);
    for (let i = 0; i < properties.length; i++) {
      const descriptor = Object_getOwnPropertyDescriptor(currentObj, properties[i]);
      if (descriptor && typeof descriptor.get === 'function') {
        return true;
      }
    }
    currentObj = Object_getPrototypeOf(currentObj);
    depth++;
  }
  return false;
}

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

function ObjectX(){if (!(this instanceof ObjectX)){return new ObjectX()}};

const S_FUNCTION = "(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";
const S_SETUP = `delete constructor.__proto__.__proto__.constructor;
delete constructor.__proto__.__proto__.__defineGetter__;
delete constructor.__proto__.__proto__.__defineSetter__;
Object.setPrototypeOf(constructor.prototype,null);`+['eval','Function','Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'].map(v=>'delete '+v+';').join('') + `Object.__proto__.constructor=Function=constructor.__proto__.constructor=${S_FUNCTION};for(let k of Object.getOwnPropertyNames(Object))if(['fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0)delete Object[k];`;

const jevalx_ext = (js,ctx,timeout=666,js_opts)=>{
  let rst,ctxx;
  fwd_eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];
  if (!ctx || !vm.isContext(ctx)){
    ctxx = vm.createContext(new ObjectX);
    [ctxx,rst] = jevalx_raw(S_SETUP,ctxx);
    ctxx.console_log = console_log;
    ctxx.eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];//essential.
    if (ctx) Object_assign(ctxx,ctx);
  }else{ ctxx = ctx; }
  return jevalx_raw(js,ctxx,timeout,js_opts)
}

let jevalx_core = async(js,ctx,timeout=666,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0;
  let tmpHandler = (reason, promise)=>{ if (!err) err={message:'Evil',js} };
  process.addListener('unhandledRejection',tmpHandler);
  let check_Promise= (seq=0)=>{
    if (Promise___proto___apply!=Promise.__proto__.apply){
      evil++;err = {message:'EvilPromiseApply'+seq,js};
      Promise.__proto__.apply = Promise___proto___apply
    }
    if (Promise___proto___catch!=Promise.__proto__.catch){
      evil++;err = {message:'EvilPromiseCatch'+seq,js};
      Promise.__proto__.catch = Promise___proto___catch
    }
    if (Promise___proto___then!=Promise.__proto__.then){
      evil++;err = {message:'EvilPromiseThen'+seq,js};
      Promise.__proto__.then = Promise___proto___then
    }
  };
  let resetPromise=()=>{
    Promise.__proto__.apply = Promise___proto___apply;
    Promise.__proto__.catch= Promise___proto___catch;
  }
  try{
    Promise.prototype.apply = function() {
      if (evil || err) {
        resetPromise();
        throw err;
      }
      return Promise_prototype_apply.apply(this, arguments);
    };
    Promise.prototype.catch = function() {
      if (evil || err) {
        resetPromise();
        throw err;
      }
      return Promise_prototype_catch.apply(this, arguments);
    };

    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      if (user_import_handler) {
        return user_import_handler({specifier, referrer, importAttributes})
      }
      //if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
      evil++; err = {message:'EvilImport',js};
      check_Promise();
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV ONLY...
      try{
        [ctxx,rst] = jevalx_ext(js,ctx,timeout,js_opts);
        let sandbox_level = 9;
        for (var i=0;i<sandbox_level;i++) {
          //console_log('debug',i,rst);
          if (evil || !rst || err) break;
          if (findEvilGetter(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {//run in the sandbox !
            ctxx['rst_tmp']=rst;
            [ctxx,rst] = jevalx_ext('rst_tmp()',ctxx,timeout,js_opts);
          }else if (rst.then){
            rst = await new Promise(async(r,j)=>{
              setTimeout(()=>j({message:'Timeout',js}),timeout);
              try{ r(await rst) } catch(ex) { j(ex) };
            });
          } else break;
        }
      check_Promise(1);
      }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilUnknown'),js}; }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
    //check_Promise(2);
  }catch(ex){ err = {message:ex?.message||'EvilX',js}; }
  //resetPromise();
  process.removeListener('unhandledRejection',tmpHandler);
  if (evil || err) throw err;
  return rst;
}
var jevalx = jevalx_core;
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,jevalx_ext,S_SETUP}


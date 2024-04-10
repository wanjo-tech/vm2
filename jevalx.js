const vm = require('node:vm');

//for dev/performance boost:
const console_log = console.log;
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
const Object_assign = Object.assign;

// for __proto__ Pollultion:
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

// for Promise Pollultion:
//const Promise___proto___ = Object.getPrototypeOf(Promise);
//const Promise___proto___catch = Promise.__proto__.catch;
//const Promise___proto___then = Promise.__proto__.then;
const Promise___proto___apply = Promise.__proto__.apply;
const Promise_prototype_catch = Promise.prototype.catch;
const Promise_prototype_then = Promise.prototype.then;
const Promise_prototype_apply = Promise.prototype.apply;
function resetPromise(){
  Promise.__proto__.apply = Promise___proto___apply;
  Promise.prototype.catch = Promise_prototype_catch;
  Promise.prototype.apply= Promise_prototype_apply;
  Promise.prototype.then= Promise_prototype_then;
  Promise.__proto__.constructor=Function;//last piece ;)
}

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

//for dev test:
//function Global(){if (this instanceof Global){}else{return new Global()}};

const S_FUNCTION = "(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";
const S_SETUP = `
//delete Object.prototype.constructor;//just the 'Object' itself in sandbox.
//delete constructor.__proto__.__proto__.constructor;
//delete constructor.__proto__.__proto__.__defineGetter__;
//delete constructor.__proto__.__proto__.__defineSetter__;
`+['eval','Function','Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'].map(v=>'delete '+v+';').join('') 
+`Object.__proto__.constructor=Function=${S_FUNCTION};
for(let k of Object.getOwnPropertyNames(Object)){if(['fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0)delete Object[k]}
constructor.__proto__.constructor=Function;//important.
`;

const jevalx_ext = (js,ctx,timeout=666,js_opts)=>{
  let rst,ctxx;
  fwd_eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];
  if (!ctx || !vm.isContext(ctx)){
    //ctxx = vm.createContext(new Global);
    ctxx = vm.createContext(new function(){});
    [ctxx,rst] = jevalx_raw(S_SETUP,ctxx);
    ctxx.console_log = console_log;
    //ctxx.setTimeout= setTimeout;//for dev test only
    ctxx.dev_getOwnPropertyNames = Object.getOwnPropertyNames;
    ctxx.eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];//essential.
    if (ctx) Object_assign(ctxx,ctx);
  }else{ ctxx = ctx; }
  return jevalx_raw(js,ctxx,timeout,js_opts)
}

let jevalx_core = async(js,ctx,timeout=666,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0;
  let tmpHandler = (reason, promise)=>{ if (!err) err={message:'EvilX',js};console.log(999,reason) };
  process.addListener('unhandledRejection',tmpHandler);
  try{
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      if (!evil && !err){
        if (user_import_handler) { return user_import_handler({specifier, referrer, importAttributes}) }
        if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
      }
      evil++; err = {message:'EvilImport',js};
      Promise.prototype.then = function() {
        if (evil || err) { resetPromise(); throw err; }
        return Promise_prototype_then.apply(this, arguments);
      };
      Promise.prototype.apply = function() {
        if (evil || err) { resetPromise(); throw err; }
        return Promise_prototype_apply.apply(this, arguments);
      };
      Promise.prototype.catch = function() {
        if (evil || err) { resetPromise(); throw err; }
        return Promise_prototype_catch.apply(this, arguments);
      };
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV TEST...
      try{
        [ctxx,rst] = jevalx_ext(js,ctx,timeout,js_opts);
        let sandbox_level = 9;
        for (var i=0;i<sandbox_level;i++) {
          ////console_log('debug',i,rst);
          if (evil || !rst || err) break;
          if (findEvilGetter(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {//run in the sandbox !
            ctxx['rst_tmp']=rst;
            [ctxx,rst] = jevalx_ext('(()=>rst_tmp())()',ctxx,timeout,js_opts);
          }else if (rst.then){
            rst = await new Promise(async(r,j)=>{
              setTimeout(()=>j({message:'Timeout',js}),timeout);
              try{ r(await rst) } catch(ex) { j(ex) };
            });
          } else break;
        }
        if (findEvilGetter(rst)) throw {message:'EvilProtoX',js};
      }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilUnknown'),js}; }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilXX',js}; }
  finally{
    process.removeListener('unhandledRejection',tmpHandler);
    resetPromise();
  }
  if (evil || err) throw err;
  return rst;
}
var jevalx = jevalx_core;

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,jevalx_ext,S_SETUP}


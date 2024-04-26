const processWtf = require('process');
let onError_jevalx = (e,rs)=>{ console.error('----------- onError_jevalx {',[e,rs],'} ---------------') };
processWtf.addListener('unhandledRejection',(processWtf.env?.debug_jevalx>1)?onError_jevalx:()=>0);
//processWtf.addListener('uncaughtException',onError_jevalx)

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_setPrototypeOf = Object.setPrototypeOf;
const X=function(){}
Object.defineProperty(Object.prototype,'__proto__',{get(){console.log('911_get')},set(newValue){console.log('911_set',newValue)}});
eval(['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'].map(v=>'delete '+v+';').join(''));

const S_SESSION = `[console,Promise,Object,Function,globalThis]`;
const S_SETUP = `(()=>{
let is_sandbox = 'function'!=typeof clearTimeout;
let Object_defineProperty = Object.defineProperty;
Object_defineProperty(Object.prototype,'__proto__',{get(){},set(newValue){}});
let BlackList = new Set(['then', 'toString', 'toJSON', 'constructor']);
const safeCopy = obj => 
    obj === null || typeof obj !== 'object' ? obj : 
    Array.isArray(obj) ? obj.map(safeCopy) : 
    Object.fromEntries(
        Object.getOwnPropertyNames(obj) .filter(key => !BlackList.has(key)) .map(key => [key, safeCopy(obj[key])])
    );
Object_defineProperty(this,'safeCopy',{get:()=>safeCopy});
const delay = async(t)=>{
  let i=0;
  if (t>0){
    let t0 = new Date().getTime();
    while(new Date().getTime()<t0+t) ++i;
  }
  return i
};
Object_defineProperty(this,'delay',{get:()=>delay});
if (is_sandbox){
  let WhiteList = new Set(['Object','Array','JSON','Promise','Function','eval','globalThis','Date','Math','Number','String','Set','console']);
  for (let v of Object.getOwnPropertyNames(this)){if(!WhiteList.has(v))delete this[v]}
};
`+['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__'].map(v=>'delete '+v+';').join('')
+`
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}return ${S_SESSION}})()`;
let jevalx_host_name_a=['Promise','Object','Function'];
const S_ENTER = jevalx_host_name_a.map(v=>`${v}.prototype.constructor=X;`).join('');//
const S_EXIT = jevalx_host_name_a.map(v=>`${v}.prototype.constructor=${v};`).join('');

const vm = require('node:vm');
const timers = require('timers');
const setTimeout = timers.setTimeout;
let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];
let filterError = (ex,err,jss) =>{
  if (!err) {
    let message = 'EvilX', code;
    if (ex) {
      Object_setPrototypeOf(ex,Object.prototype);//clear intended __proto__
      let message_desc = Object_getOwnPropertyDescriptor(ex,'message');//@t4
      if (message_desc && (message_desc.get || message_desc.set)){
      } else if(ex.message) { message = ex.message; }
      let code_desc = Object_getOwnPropertyDescriptor(ex,'code');//@t3
      if (code_desc && (code_desc.get || code_desc.set)){
      }else if(ex.code) { code = ex.code }
      err={message,jss};
      if (code) err.code = code;
    }
  }
  return err;
}
let jevalx_core = async(js,ctx,options={})=>{
  let call_id = 'code'+new Date().getTime();
  let {timeout=666,json_output=false,return_arr=false,user_import_handler=undefined,microtaskMode='afterEvaluate'}=(typeof options=='object'?options:{});
  if (microtaskMode!='afterEvaluate') microtaskMode = undefined;
  if (typeof options=='number') timeout = options;
  let ctxx,rst,err,jss= JSON.stringify(js),last_reject;
  let Promise_prototype_catch = Promise.prototype.catch;
  let Promise_prototype_then = Promise.prototype.then;
  let Promise_prototype_finally = Promise.prototype.finally;
  try{
    let _console,_Promise,_Object,_Function;
    rst = await new Promise(async(resolve,reject)=>{
      setTimeout(()=>{reject({message:'TimeoutX',code:'ERR_SCRIPT_EXECUTION_TIMEOUT',js})},timeout+111);//Q7x
      if (ctx && vm.isContext(ctx)) {
        ctxx = ctx;
        [_console,_Promise,_Object,_Function] = jevalx_raw(S_SESSION,ctxx)[1];
      }
      else {
        ctxx = vm.createContext(new function(){},{microtaskMode});
        [ctxx,[_console,_Promise,_Object,_Function]] = jevalx_raw(S_SETUP,ctxx);
        _console.log = console.log;
        _console.error = console.error;
        if (ctx) Object.assign(ctxx,ctx);
      }
      let _Promise_prototype_then = _Promise.prototype.then;
      eval(S_ENTER);
      try{
        delete Promise.prototype.catch;//@s9
        delete _Promise.prototype.then;//@s*
        delete _Promise.prototype.catch;
        let promise = jevalx_raw(`(async({},z)=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));z=(${!!json_output})?JSON.stringify(z):safeCopy(z);return z})((()=>({}))(),eval(${jss}))`,ctxx,timeout,{filename:call_id})[1]//.then(resolve).catch(reject);
        let promise_then = _Promise_prototype_then.call(promise,z=>resolve(z),zz=>reject(zz));
      }catch(ex){ reject(ex);
      }finally{
        if (Promise.prototype.catch != Promise_prototype_catch) {
          Promise.prototype.catch = Promise_prototype_catch;//
        }
      }
    });
  }catch(ex){ err = filterError(ex,err,jss) }
  finally{ eval(S_EXIT); }
  if (err) {
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG') { err.message = 'EvilImportX'; err.code='EVIL_IMPORT_FLAG';}
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING') { err.message = 'EvilImport'; err.code='EVIL_IMPORT';}
    if (err?.code=='ERR_SCRIPT_EXECUTION_TIMEOUT') {err.message = 'Timeout'+timeout;err.code='TIMEOUT';}
    if (!err?.id) err.id = call_id;
  }
  if (err) throw err;
  if (return_arr) return [ctxx,rst,call_id,js];
  return rst;
}
let jevalx = jevalx_core;
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,
VER:'rc5'
}

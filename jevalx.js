const processWtf = require('process');
let onError_jevalx = (e,rs)=>{ console.error('----------- onError_jevalx {',[e,rs],'} ---------------') };
processWtf.addListener('unhandledRejection',(processWtf.env?.debug_jevalx>1)?onError_jevalx:()=>0);
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_setPrototypeOf = Object.setPrototypeOf;
const X=function(){}
Object.defineProperty(Object.prototype,'__proto__',{get(){console.log('911_get')},set(newValue){console.log('911_set',newValue)}});
eval(['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__'].map(v=>'delete '+v+';').join(''));
let Promise_prototype_then = Promise.prototype.then;
const S_SESSION = `[console,Promise,Object,Function,globalThis]`;
const S_SETUP = `(()=>{
let is_sandbox = 'function'!=typeof clearTimeout;
let Object_defineProperty = Object.defineProperty;
Object_defineProperty(Object.prototype,'__proto__',{get(){},set(newValue){}});
let BlackList = new Set(['then', 'toString', 'toJSON', 'constructor']);
const safeCopy = obj => obj === null || typeof obj !== 'object' ? obj : Array.isArray(obj) ? obj.map(safeCopy) : 
  Object.fromEntries(Object.getOwnPropertyNames(obj).filter(key =>!BlackList.has(key)&&obj[key]!=obj).map(key=>[key,safeCopy(obj[key])]));
Object_defineProperty(this,'safeCopy',{get:()=>safeCopy});
Promise.delay=async(t)=>{let i=0;if (t>0){let t0=new Date().getTime();while(new Date().getTime()<t0+t)++i}return i};//DEV-ONLY
if (is_sandbox){
  Object.getOwnPropertyNames(Function.prototype).forEach(prop=>{delete Function.prototype[prop]});
  let WhiteList = new Set(['Object','Array','JSON','Promise','Function','eval','globalThis','Date','Math','Number','String','Set','console']);
  for (let v of Object.getOwnPropertyNames(this)){if(!WhiteList.has(v))delete this[v]}
};
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}return ${S_SESSION}})()`;
let jevalx_host_name_a=['Promise','Object','Function'];
const S_ENTER = jevalx_host_name_a.map(v=>`${v}.prototype.constructor=X;`).join('')
const S_EXIT = jevalx_host_name_a.map(v=>`${v}.prototype.constructor=${v};`).join('')
const vm = require('node:vm');
const timers = require('timers');
const setTimeout = timers.setTimeout;
let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];
let jevalx_core = async(js,ctx,options={})=>{
  let call_id = 'code'+new Date().getTime();
  let {timeout=666,json_output=false,return_arr=false,user_import_handler=undefined,microtaskMode='afterEvaluate'}=(typeof options=='object'?options:{});
  if (microtaskMode!='afterEvaluate') microtaskMode = undefined;
  if (typeof options=='number') timeout = options;
  let ctxx,rst,err,jss= JSON.stringify(js);
  try{rst = await new Promise((resolve,reject)=>{try{
    let _console;
    setTimeout(()=>{reject({message:'TimeoutX',code:'ERR_SCRIPT_EXECUTION_TIMEOUT',js})},timeout+11);//Q7x
    if (ctx && vm.isContext(ctx)) {ctxx = ctx;[_console] = jevalx_raw(S_SESSION,ctxx)[1]}
    else {
      ctxx = vm.createContext(new X,{microtaskMode});
      [ctxx,[_console]] = jevalx_raw(S_SETUP,ctxx);
      _console.log = console.log; _console.error = console.error;
      if (ctx) Object.assign(ctxx,ctx);
    }
    eval(S_ENTER);
    Promise_prototype_then.call(jevalx_raw(`(async()=>{try{return await(async(z)=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return(${!!json_output})?JSON.stringify(z):safeCopy(z)})(eval(${jss}))}catch(ex){return Promise.reject(safeCopy(ex))}})()`,ctxx,timeout,{filename:call_id})[1],resolve,reject);
  }catch(ex){reject(ex)}})}catch(ex){err=ex}finally{eval(S_EXIT)}
  if (err) {
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG') { err.message = 'EvilImportX'; err.code='EVIL_IMPORT_FLAG';}
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING') { err.message = 'EvilImport'; err.code='EVIL_IMPORT';}
    if (err?.code=='ERR_SCRIPT_EXECUTION_TIMEOUT') {err.message = 'Timeout'+timeout;err.code='TIMEOUT';}
    if (!err?.id) err.id = call_id;
    if (!err?.id) err.jss = jss;
  }
  if (return_arr) return [err,rst,ctxx,call_id,js];
  if (err) throw err;
  return rst;
}
let jevalx = jevalx_core;
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,S_ENTER,S_EXIT,X,VER:'rc6'}

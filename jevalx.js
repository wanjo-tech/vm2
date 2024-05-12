const processWtf = require('process'),vm = require('node:vm'),timers = require('timers'),X=function(){};
let onError_jevalx = (e,rs)=>{ console.error('----------- onError_jevalx {',[e,rs],'} ---------------') };
processWtf.addListener('unhandledRejection',(processWtf.env?.debug_jevalx>1)?onError_jevalx:()=>0);
//processWtf.addListener('unhandledException',onError_jevalx);
Object.defineProperty(Object.prototype,'__proto__',{get(){console.error('911_get')},set(newValue){console.error('911_set',newValue)}});
eval(['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__'].map(v=>'delete '+v+';').join(''));

const Array_isArray = Array.isArray;
const Array_from = Array.from;
const Object_getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
const Object_entries= Object.entries;

let BlackListCopy = new Set(['then', 'toString', 'toJSON', 'constructor']);
//@(s27,t10,t13,t8,t9)
const safeCopy = (obj, cache = new Map()) => {
  if (obj === null || typeof obj !== 'object') { return obj; }
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  if (Array_isArray(obj)) {
    const arrayCopy = Array_from(obj, v => safeCopy(v, cache));
    cache.set(obj, arrayCopy);
    return arrayCopy;
  }
  const descriptors = Object_getOwnPropertyDescriptors(obj);
  const safeObj = {};
  cache.set(obj, safeObj);
  for (const [key, descriptor] of Object_entries(descriptors)) {
    if (!descriptor.get && !BlackListCopy.has(key) && obj[key] !== obj) {
      safeObj[key] = safeCopy(descriptor.value, cache);
    }
  }
  return safeObj;
};

const S_SETUP = `(()=>{if ('function'!=typeof clearTimeout){
let Object=({}).constructor;
Object.defineProperty(Object.prototype,'__proto__',{get(){console.error('911_get')},set(newValue){console.error('911_set',newValue)}});
`+['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__'].map(v=>'delete '+v+';').join('')+`
//Promise.delay=async(t)=>{let i=0;if (t>0){let t0=new Date().getTime();while(new Date().getTime()<t0+t)++i}return i};//
//['call','bind','apply'].forEach(prop=>{delete Function.prototype[prop]});

let WhiteListGlobal = ['console','Object','Array','JSON','Promise','Function','eval','globalThis','Date','Math','Number','String','Set'];for (let v of Object.getOwnPropertyNames(this)){if(!(WhiteListGlobal.indexOf(v)>=0)){delete this[v]}}

let WhiteListObject = ['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'];
for(let k of Object.getOwnPropertyNames(Object)){if(!(WhiteListObject.indexOf(k)>=0)){ delete Object[k]}}
}})()`;
let jevalx_host_name_a=['Promise','Object','Function','RangeError','TypeError'];
const S_ENTER = jevalx_host_name_a.map(v=>`${v}.prototype.constructor=X;`).join('')
const S_EXIT = jevalx_host_name_a.map(v=>`${v}.prototype.constructor=${v};`).join('');

//@s1
['call','bind','apply','toString','valueOf'].forEach(prop=>{Object.setPrototypeOf(Function.prototype[prop],null);Object.freeze(Function.prototype[prop])});

//@s25
Object.freeze(Promise.prototype.then);
Object.freeze(Promise.prototype.catch);
Object.freeze(Promise.prototype.finally);
Object.freeze(Promise.prototype);
//Object.freeze(Promise);

let jevalx_raw = (js,ctxx,js_opts,ctx_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,ctx_opts)];
let jevalx= async(js,ctx,options={})=>{
  let call_id = 'code'+new Date().getTime(),ctxx,rst,err,jss=JSON.stringify(js);
  let {json_output=false,return_arr=false,user_import_handler=undefined,microtaskMode=undefined}=(typeof options=='object'?options:{});
  if (microtaskMode!='afterEvaluate') microtaskMode = undefined;
  try{
    rst = await new Promise((resolve,reject)=>{try{
      let _console;
      if (ctx && vm.isContext(ctx)){

/** example Proxy way ;)
let ctx={};//..
let ctxx= require('vm').createContext(new Proxy({},{get(target,prop,receiver){
  //if (prop in target) return target[prop];//no
  if (prop in ctx) return ctx[prop];//
  console.error('SKIP Proxy',typeof prop,prop);
}}));
var {X,S_SETUP,jevalx,jevalx_raw} = require('./jevalx');
jevalx_raw(S_SETUP,ctxx);
ctx.evalx = (js)=>jevalx_raw(js,ctxx)[1];//
ctx.console = console;
*/
        ctxx = ctx;//
      } else {
        ctxx = vm.createContext(new X,{microtaskMode});
        ctxx.console = console;//
        jevalx_raw(S_SETUP,ctxx);
        if (ctx) Object.assign(ctxx,ctx);
        ctxx.evalx = (js)=>jevalx_raw(js,ctxx)[1];//
      }
      eval(S_ENTER);
      //let promise=jevalx_raw(`(async()=>await(async(z)=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return z})(eval(${jss})))()`,ctxx,{filename:call_id})[1];
      let promise=jevalx_raw(`(async()=>await(async(z)=>{while(z&&((z.then)&&(z=await z)||(typeof z=='function')&&(z=z())));return z})(evalx(${jss})))()`,ctxx,{filename:call_id})[1];
      Promise.prototype.catch.call(promise,tmp_ex=>{});//@s23,--trace-warnings
      timers.setTimeout(()=>{Promise.prototype.then.call(promise,tmp=>resolve(safeCopy(tmp)),reject)},1)//@(s17,s18,s19,s23,s24,s25)
    }catch(ex){reject(ex)}});
  }catch(ex){err=safeCopy(ex)}finally{eval(S_EXIT)}
  if (err) {
    if (typeof err.code!='string') delete err.code;//@t3
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG') { err.message = 'EvilImportX'; err.code='EVIL_IMPORT_FLAG';}
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING') { err.message = 'EvilImport'; err.code='EVIL_IMPORT';}
    if (!err.code) err.code = 'EvilX';
    err.id = call_id; err.jss = jss;
  }
  if (return_arr) return [err,rst,ctxx,call_id,js]; if (err) throw err; return rst;
}
if (typeof module!='undefined') module.exports = {jevalx,jevalx_raw,S_SETUP,S_ENTER,S_EXIT,X,VER:'v1.1'}

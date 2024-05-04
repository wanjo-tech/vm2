const processWtf = require('process'),vm = require('node:vm'),timers = require('timers'),X=function(){};
let onError_jevalx = (e,rs)=>{ console.error('----------- onError_jevalx {',[e,rs],'} ---------------') };
processWtf.addListener('unhandledRejection',(processWtf.env?.debug_jevalx>1)?onError_jevalx:()=>0);
//processWtf.addListener('unhandledException',onError_jevalx);
Object.defineProperty(Object.prototype,'__proto__',{get(){console.error('911_get')},set(newValue){console.error('911_set',newValue)}});
eval(['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__'].map(v=>'delete '+v+';').join(''));
RangeError.prototype.constructor=X;
TypeError.prototype.constructor=X;

const Array_isArray = Array.isArray;
const Array_from = Array.from;
let BlackListCopy = new Set(['then', 'toString', 'toJSON', 'constructor']);
const safeCopy = (obj) => {
  if (obj === null || typeof obj !== 'object') { return obj; }
  if (Array_isArray(obj)) return Array_from(obj,v=>safeCopy(v));
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const safeObj = {};
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (!descriptor.get && !BlackListCopy.has(key) && obj[key] !== obj) { safeObj[key] = safeCopy(descriptor.value); }
  }
  return safeObj;
};

const S_SESSION = `[console,Promise,Object,Function,globalThis]`;
const S_SETUP = `(()=>{
Object.defineProperty(Object.prototype,'__proto__',{get(){console.error('911_get')},set(newValue){console.error('911_set',newValue)}});
`+['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__'].map(v=>'delete '+v+';').join('')+`
Promise.delay=async(t)=>{let i=0;if (t>0){let t0=new Date().getTime();while(new Date().getTime()<t0+t)++i}return i};//DEV-ONLY
if ('function'!=typeof clearTimeout){
  //['call','bind','apply'].forEach(prop=>{delete Function.prototype[prop]});
  let WhiteListGlobal = new Set(['Object','Array','JSON','Promise','Function','eval','globalThis','Date','Math','Number','String','Set','console']);for (let v of Object.getOwnPropertyNames(this)){if(!WhiteListGlobal.has(v))delete this[v]}
};
let WhiteListObject = new Set(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames']);
for(let k of Object.getOwnPropertyNames(Object)){if(!WhiteListObject.has(k)){delete Object[k]}}return ${S_SESSION}})()`;
let jevalx_host_name_a=['Promise','Object','Function'];
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

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];
let jevalx= async(js,ctx,options={})=>{
  let call_id = 'code'+new Date().getTime(),ctxx,rst,err,jss=JSON.stringify(js);
  let {timeout=666,json_output=false,return_arr=false,user_import_handler=undefined,microtaskMode='afterEvaluate'}=(typeof options=='object'?options:{});
  if (microtaskMode!='afterEvaluate') microtaskMode = undefined;
  if (typeof options=='number') timeout = options;
  try{
    rst = await new Promise((resolve,reject)=>{try{
      let _console;
      timers.setTimeout(()=>{reject({message:'TimeoutX',code:'TIMEOUTX',js})},timeout+11);//Q7x
      if (ctx && vm.isContext(ctx)) [ctxx,[_console]] = jevalx_raw(S_SESSION,ctx);
      else {
        ctxx = vm.createContext(new X,{microtaskMode});
        [ctxx,[_console]] = jevalx_raw(S_SETUP,ctxx);
        _console.log = console.log; _console.error = console.error;
        if (ctx) Object.assign(ctxx,ctx);
      }
      eval(S_ENTER);
      let promise=jevalx_raw(`(async()=>await(async(z)=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return z})(eval(${jss})))()`,ctxx,timeout,{filename:call_id})[1];
      Promise.prototype.catch.call(promise,tmp_ex=>{});//@s23,--trace-warnings
      timers.setTimeout(()=>{Promise.prototype.then.call(promise,tmp=>resolve(safeCopy(tmp)),reject)},1)
    }catch(ex){reject(ex)}});
  }catch(ex){err=safeCopy(ex)}finally{eval(S_EXIT)}
  if (err) {
    if (typeof err.code!='string') delete err.code;//@t3
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG') { err.message = 'EvilImportX'; err.code='EVIL_IMPORT_FLAG';}
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING') { err.message = 'EvilImport'; err.code='EVIL_IMPORT';}
    if (err?.code=='ERR_SCRIPT_EXECUTION_TIMEOUT') {err.message = 'Timeout'+timeout;err.code='TIMEOUT';}
    if (!err.code) err.code = 'EvilX';
    err.id = call_id; err.jss = jss;
  }
  if (return_arr) return [err,rst,ctxx,call_id,js]; if (err) throw err; return rst;
}
if (typeof module!='undefined') module.exports = {jevalx,jevalx_raw,S_SETUP,S_ENTER,S_EXIT,X,VER:'v1'}

/** Quick Notes:

All known escape instances are related to the Host Object.

Our strategy involves cutting off connections to the components to mitigate risks.

Keypoints marked '//L0' in the source code.

*/

//L0
Object.defineProperty(Object.prototype, '__proto__', {
  get() { console.log('host__proto__911_get');return undefined; },
  set(newValue) { console.log('host__proto__911_set',newValue) }
});
const X=function(){}
Object.setPrototypeOf(X.prototype,null);//L0
Object.setPrototypeOf(X,X.prototype);//L0

Object.defineProperty(globalThis,'AsyncFunction',{value:(async()=>{}).constructor,writable:false,enumerable:false,configurable:false});// TOOL

//@r28
eval(['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'].map(v=>'delete '+v+';').join(''));

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
function findEvil(obj,maxdepth=3) {
  let currentObj = obj;
  let depth = 0;
  while (currentObj !== null && currentObj!==undefined && depth < maxdepth) {
    const properties = ['message','code','constructor','then'];//Object_getOwnPropertyNames(currentObj);
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
const vm = require('node:vm');
const processWtf = require('process');
const timers = require('timers');
const setTimeout = timers.setTimeout;
const delay = (t,rt)=>new Promise((r,j)=>setTimeout(()=>r(rt),t));

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

const S_SETUP = `(()=>{
let Object_defineProperty = Object.defineProperty;
Object_defineProperty(Object.prototype,'__proto__',{
  get() { console.log('box__proto__911_get');return undefined; },
  set(newValue) { console.log('box__proto__911_set',newValue) }
});//L0
`+[
//'console',//L2
'WebAssembly','Error','AggregateError','EvalError','RangeError','ReferenceError','SyntaxError','TypeError','URIError',//L1
'Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__',//L0
].map(v=>'delete '+v+';').join('')
+`
Object.defineProperty(globalThis,'AsyncFunction',{value:(async()=>{}).constructor,writable:false,enumerable:false,configurable:false});
//setTimeout = (f,t)=>Promise.delay(t).then(f);
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}//L0
return Promise})()`;

let jevalx_host_a = [ RangeError, TypeError, Promise, Object, AsyncFunction, Function ];
let jevalx_core = async(js,ctx,options={})=>{
  let {timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined}=(typeof options=='object'?options:{});
  if (typeof options=='number') timeout = options;//
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js),done=false;
  let last_resolve,last_reject;//for quicker return.
    let tmpHandler = (ex, promise)=>{ if (!err) err={message:ex?.message||'EvilXa',js,code:ex?.code,tag:Promise?'Xb':'Xa',ex};
      if (!done && last_reject) {
        last_reject(err);
      }
    };
  try{
    processWtf.addListener('unhandledRejection',tmpHandler);
    processWtf.addListener('uncaughtException',tmpHandler)
    let _Promise;
    //to support the user_import_handler()
    let js_opts;//TODO for import()
    await new Promise(async(r,j)=>{
      last_resolve = r, last_reject = j;
      delay(timeout+666).then(()=>{done=true;j({message:'TimeoutX',js,js_opts})})//L0 @Q7x
      try{
        if (ctx && vm.isContext(ctx)) { ctxx = ctx } //SESSION
        else {
          ctxx = vm.createContext(new X);//BIGBANG
          [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);
          _Promise.delay = (t,r)=>new _Promise((rr,jj)=>delay(t).then(()=>(done||rr(r))));
          ctxx.console = {log:console.log};//can be replaced by ctx.console
          if (ctx) Object.assign(ctxx,ctx);
        }
        jevalx_host_a.forEach(o=>(o.prototype.constructor=X));
        [ctxx,rst] = jevalx_raw(`(async()=>{try{return await(async z=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return ${!!json_output}?JSON.stringify(z):z})(eval(${jss}))}catch(ex){return Promise.reject(ex)}})()`,ctxx,timeout,js_opts);
        rst = await rst;//above we use (async()=>{...})() which sure is a Promise
        done = true;
        if (findEvil(rst)) throw {message:'EvilProtoX',js};//@r4
        if (rst) {delete rst.then;delete rst.toString;delete rst.toJSON}//@Q15
      }catch(ex){
        done = true;
        if (!err) err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js,code:ex?.code,tag:'Xc',ex};
        err.message=='EvilXc' && console.log('EvilXc=>',ex,'<=',jss)
      }
      delay(1).then(()=>(evil||err)?j(err):r(rst))
    });
  }catch(ex){
    done = true;
    if (!err) err = {message:ex?.message||'EvilXd',js,code:ex?.code,tag:'Xd'};
    err.message=='EvilXd' && console.log('EvilXd=>',ex,'<=',jss) //currently only TimeoutX @Q7x
  }
  finally{
    if (done) {
      jevalx_host_a.forEach(o=>(o.prototype.constructor=o));
    } else { console.log('TODO finally not done?') }
    processWtf.removeListener('unhandledRejection',tmpHandler);
    processWtf.removeListener('uncaughtException',tmpHandler)
  }
  if (err) {
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG') { err.message = 'EvilImportX'; err.code='EVIL_IMPORT_FLAG';}
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING') { err.message = 'EvilImport'; err.code='EVIL_IMPORT';}
    if (err?.code=='ERR_SCRIPT_EXECUTION_TIMEOUT') {err.message = 'Timeout'+timeout;err.code='TIMEOUT';}
    if (!err?.time) err.time = new Date().getTime();//for app
    if (!err?.id) err.id = err.time;//for app
  }
  if (evil || err) throw err;
  if (return_ctx) return [ctxx,rst];
  return rst;
}
let jevalx = jevalx_core;

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,delay,X,findEvil,
VER:'rc3d'
}


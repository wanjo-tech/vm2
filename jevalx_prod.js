Object.defineProperty(Object.prototype, '__proto__', { get() { console.log('host__proto__911_get');return undefined; }, set(newValue) { console.log('host__proto__911_set',newValue) } });
const X=function(){}
Object.setPrototypeOf(X.prototype,null);
Object.setPrototypeOf(X,X.prototype);
Object.defineProperty(globalThis,'AsyncFunction',{value:(async()=>{}).constructor,writable:false,enumerable:false,configurable:false});

eval(['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'].map(v=>'delete '+v+';').join(''));

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const vm = require('node:vm');
const processWtf = require('process');
const timers = require('timers');
const setTimeout = timers.setTimeout;
const delay = (t,rt)=>new Promise((r,j)=>setTimeout(()=>r(rt),t));
let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];
const S_SETUP = `(()=>{
Object.defineProperty(Object.prototype,'__proto__',{ get() { console.log('box__proto__911_get');return undefined; }, set(newValue) { console.log('box__proto__911_set',newValue) } });
`+[
'WebAssembly','Error','AggregateError','EvalError','RangeError','ReferenceError','SyntaxError','TypeError','URIError',
'Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__',
].map(v=>'delete '+v+';').join('')
+`
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}return Promise})()`;

let jevalx_host_a = [ RangeError, TypeError, Promise, Object, AsyncFunction, Function ];
let jevalx_core = async(js,ctx,options={})=>{
  let {timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined}=(typeof options=='object'?options:{});
  if (typeof options=='number') timeout = options;
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js),done=false;
  let last_resolve,last_reject;
  let tmpHandler = (ex, promise)=>{ if (!err) err={message:ex?.message||'EvilXa',js,code:ex?.code,tag:Promise?'Xb':'Xa',ex}; if (last_reject) last_reject(err); };
  try{
    processWtf.addListener('unhandledRejection',tmpHandler);
    processWtf.addListener('uncaughtException',tmpHandler)
    let _Promise;
    await new Promise(async(r,j)=>{
      last_resolve = r, last_reject = j;
      delay(timeout+666).then(()=>j({message:'TimeoutX',js}))
      try{
        if (ctx && vm.isContext(ctx)) ctxx = ctx;
        else {
          ctxx = vm.createContext(new X);
          [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);
          _Promise.delay = (t,r)=>new _Promise((rr,jj)=>delay(t).then(()=>(done||rr(r))));
          ctxx.console = console;
          if (ctx) Object.assign(ctxx,ctx);
        }
        jevalx_host_a.forEach(o=>(o.prototype.constructor=X));
        [ctxx,rst] = jevalx_raw(`(async()=>{try{return await(async z=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return ${!!json_output}?JSON.stringify(z):z})(eval(${jss}))}catch(ex){return Promise.reject(ex)}})()`,ctxx,timeout);
        rst = await rst;
        done = true;
        if (rst) {delete rst.then;delete rst.toString;delete rst.toJSON}
      }catch(ex){ if (!err) err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js,code:ex?.code,tag:'Xc',ex};
        err.message=='EvilXc' && console.log('EvilXc=>',ex,'<=',jss)
      }
      delay(1).then(()=>(evil||err)?j(err):r(rst))
    });
  }catch(ex){ if (!err) err = {message:ex?.message||'EvilXd',js,code:ex?.code,tag:'Xd'};
    err.message=='EvilXd' && console.log('EvilXd=>',ex,'<=',jss)
  }
  finally{
    jevalx_host_a.forEach(o=>(o.prototype.constructor=o));
    processWtf.removeListener('unhandledRejection',tmpHandler);
    processWtf.removeListener('uncaughtException',tmpHandler)
  }
  if (err) {
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG') { err.message = 'EvilImportX'; err.code='EVIL_IMPORT_FLAG';}
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING') { err.message = 'EvilImport'; err.code='EVIL_IMPORT';}
    if (err?.code=='ERR_SCRIPT_EXECUTION_TIMEOUT') {err.message = 'Timeout'+timeout;err.code='TIMEOUT';}
    if (!err?.time) err.time = new Date().getTime();
    if (!err?.id) err.id = err.time;
  }
  if (evil || err) throw err;
  if (return_ctx) return [ctxx,rst];
  return rst;
}
let jevalx = jevalx_core;
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,delay,
VER:'prod'
}


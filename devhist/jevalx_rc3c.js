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
// TOOL
Object.defineProperty(globalThis,'AsyncFunction',{value:(async()=>{}).constructor,writable:false,enumerable:false,configurable:false});

const vm = require('node:vm');
const processWtf = require('process');
const timers = require('timers');
const setTimeout = timers.setTimeout;

const delay = (t,rt)=>new Promise((r,j)=>setTimeout(()=>r(rt),t));

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

const S_SETUP = `
Object.defineProperty(Object.prototype,'__proto__',{get(){},set(newValue){}});//L0
Object.defineProperty(this,'AsyncFunction',{value:(async()=>{}).constructor,writable:false,enumerable:false,configurable:false});
`+[
//'console',//L2
'WebAssembly','Error','AggregateError','EvalError','RangeError','ReferenceError','SyntaxError','TypeError','URIError',//L1
'Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__',//L0
].map(v=>'delete '+v+';').join('')
+`
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}//L0
Promise
`;

let jevalx_core = async(js,ctx,options={})=>{
  let {timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined}=(typeof options=='object'?options:{});
  if (typeof options=='number') timeout = options;//
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js),done=false;
  let last_resolve,last_reject;//for quicker return.
    let tmpHandler = (ex, promise)=>{ if (!err) err={message:ex?.message||'EvilXa',js,code:ex?.code,tag:Promise?'Xb':'Xa',ex};
      if (last_reject) last_reject(err);
    };
  try{
    processWtf.addListener('unhandledRejection',tmpHandler);
    processWtf.addListener('uncaughtException',tmpHandler)
    let _Promise;
    //to support the user_import_handler()
    let js_opts;//TODO for import()
    await new Promise(async(r,j)=>{
      last_resolve = r, last_reject = j;
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//L0
      try{
        if (ctx && vm.isContext(ctx)) { ctxx = ctx } //SESSION
        else {
          ctxx = vm.createContext(new X);//BIGBANG
          [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);
          _Promise.delay = (t,r)=>new _Promise((rr,jj)=>delay(t).then(()=>(done||rr(r))));
          ctxx.console = {log:console.log};//can be replaced by ctx.console
          if (ctx) Object.assign(ctxx,ctx);
        }
        Function.prototype.constructor = X;//L0
        [ctxx,rst] = jevalx_raw(`(async()=>{try{return await(async z=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return ${!!json_output}?JSON.stringify(z):z})(eval(${jss}))}catch(ex){return Promise.reject(ex)}})()`,ctxx,timeout,js_opts);
        rst = await rst;//above we use (async()=>{...})() which sure is a Promise
        done = true;
      }catch(ex){ if (!err) err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js,code:ex?.code,tag:'Xc'};
        err.message=='EvilXc' && console.log('EvilXc=>',ex,'<=',jss)
      }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ if (!err) err = {message:ex?.message||'EvilXd',js,code:ex?.code,tag:'Xd'};
    err.message=='EvilXd' && console.log('EvilXd=>',ex,'<=',jss) //currently only TimeoutX @Q7x
  }
  finally{
    Function.prototype.constructor = Function;//L1
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

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,delay,
VER:'rc3c'
}


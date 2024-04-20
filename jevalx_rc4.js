Object.defineProperty(Object.prototype,'__proto__',{get(){console.log('911_get')},set(newValue){console.log('911_set',newValue)}});
eval(['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'].map(v=>'delete '+v+';').join(''));
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
function findEvil(obj,maxdepth=3) {
  let currentObj = obj;
  let depth = 0;
  while (currentObj !== null && currentObj!==undefined && depth < maxdepth) {
    const properties = ['message','code','constructor','then','toString'];
    for (let i = 0; i < properties.length; i++) {
      let prop = properties[i];
      const descriptor = Object_getOwnPropertyDescriptor(currentObj, prop);
      if (descriptor && (typeof descriptor.get === 'function' || typeof descriptor.set == 'function')) {
        return true;
      }
      if (prop=='then' && typeof currentObj[prop]=='function') return true;
      if (prop=='toString'){ delete currentObj[prop] } //not allow customization
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
let is_sandbox = 'function'!=typeof setTimeout;
let Object_defineProperty = Object.defineProperty;
Object_defineProperty(Object.prototype,'__proto__',{get(){},set(newValue){}});

if (is_sandbox){//WhiteList14 in sandbox
  let WhiteList = ['NaN','undefined','Infinity','Object','Array','JSON','Promise','Function','eval','globalThis','Date','Math','Number','String'];
  for (let v of Object.getOwnPropertyNames(this)){
    if (WhiteList.indexOf(v)<0) delete this[v];
  };
};
`+[
'Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__',//L0
].map(v=>'delete '+v+';').join('')
+`
Object.defineProperty(globalThis,'AsyncFunction',{value:(async()=>{}).constructor,writable:false,enumerable:false,configurable:false});
setTimeout = (f,t)=>Promise.delay(t).then(f);//TESTING
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}return [Promise,Object,Function]})()`;
let jevalx_host_name_a=['Promise','Object','Function'];
let jevalx_core = async(js,ctx,options={})=>{
  let {timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined}=(typeof options=='object'?options:{});
  if (typeof options=='number') timeout = options;
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js),done=false;
  let last_reject;
  let tmpHandler = (ex, promise)=>{ if (!err) err={message:ex?.message||'EvilXa',js,code:ex?.code,tag:Promise?'Xb':'Xa',ex};
    if (!done && last_reject) { last_reject(err); }
  };
  try{
    processWtf.addListener('unhandledRejection',tmpHandler);
    processWtf.addListener('uncaughtException',tmpHandler)
    let _Promise,_Object,_Function;
    await new Promise(async(r,j)=>{
      last_resolve = r, last_reject = j;
      delay(timeout+666).then(()=>{done=true;j({message:'TimeoutX',js})})//@Q7x
      try{
        if (ctx && vm.isContext(ctx)) ctxx = ctx;
        else {
          ctxx = vm.createContext(new function(){});
          [ctxx,[_Promise,_Object,_Function]] = jevalx_raw(S_SETUP,ctxx);
          _Promise.delay = (t,r)=>new _Promise((rr,jj)=>delay(t).then(()=>(done||rr(r))));
          ctxx.console = {log: console.log};
          if (ctx) Object.assign(ctxx,ctx);
        }
        eval(jevalx_host_name_a.map(v=>`${v}.prototype.constructor=_${v};`).join(''));
        [ctxx,rst] = jevalx_raw(`(async()=>{try{return await(async z=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return ${!!json_output}?JSON.stringify(z):z})(eval(${jss}))}catch(ex){return Promise.reject(ex)}})()`,ctxx,timeout);
        rst = await rst;
        done = true;
        if (!json_output){
          if (findEvil(rst)) throw {message:'EvilProtoX',js};//@(r4,t1)
          //if (rst) {delete rst.then;delete rst.toString;delete rst.toJSON}//@Q15
        }
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
      eval(jevalx_host_name_a.map(v=>`${v}.prototype.constructor=${v};`).join(''));
    } else { console.log('TODO finally not done?') }
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
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,delay,findEvil,
VER:'rc4'
}


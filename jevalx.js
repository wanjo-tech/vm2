Object.defineProperty(Object.prototype,'__proto__',{get(){console.log('911_get')},set(newValue){console.log('911_set',newValue)}});
eval(['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'].map(v=>'delete '+v+';').join(''));
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const X=function(){}
//Object.setPrototypeOf(X,new X);
const vm = require('node:vm');
const processWtf = require('process');
const timers = require('timers');
const setTimeout = timers.setTimeout;
const delay = (t,rt)=>new Promise((r,j)=>setTimeout(()=>r(rt),t));
let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];
const S_SETUP = `(()=>{
let is_sandbox = 'function'!=typeof clearTimeout;
let Object_defineProperty = Object.defineProperty;
Object_defineProperty(Object.prototype,'__proto__',{get(){},set(newValue){}});
if (is_sandbox){
  let WhiteList = new Set(['Object','Array','JSON','Promise','Function','eval','globalThis','Date','Math','Number','String','Set','console']);
  for (let v of Object.getOwnPropertyNames(this)){if(!WhiteList.has(v))delete this[v]}
};
`+['Object.prototype.__defineGetter__','Object.prototype.__defineSetter__','Object.prototype.__lookupSetter__','Object.prototype.__lookupGetter__'].map(v=>'delete '+v+';').join('')
+`
Object_defineProperty(this,'setTimeout',{get(){return (f,t)=>Promise.delay(t).then(f)}});
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}return [Promise,Object,Function,console,globalThis]})()`;
let jevalx_host_name_a=['Promise','Object','Function'];
const S_ENTER = jevalx_host_name_a.map(v=>`${v}.prototype.constructor=X;`).join('');//
const S_EXIT = jevalx_host_name_a.map(v=>`${v}.prototype.constructor=${v};`).join('');
const AllowTypeSet = new Set(['number','string']);
let jevalx_core = async(js,ctx,options={})=>{
  let {timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined}=(typeof options=='object'?options:{});
  if (typeof options=='number') timeout = options;
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js),done=false;
  let last_reject;
  let onError = (ex, tag)=>{
    if (!err) {
      let message = 'EvilX', code;
      if (ex) {
        Object.setPrototypeOf(ex,Object.prototype);//clear intended __proto__
        let message_desc = Object_getOwnPropertyDescriptor(ex,'message');
        if (!message_desc && ex.message) message = ex.message;//@t4
        let code_desc = Object_getOwnPropertyDescriptor(ex,'code');
        if (!code_desc && ex.code) code = ex.code;
      }
      err={message,code,js,tag:typeof tag=='string'?tag:tag?'Xb':'Xa'};
      if (!done && last_reject) { last_reject(err); }
    }
  };
  try{
    processWtf.addListener('unhandledRejection',onError);
    //processWtf.addListener('uncaughtException',onError)//Xa
    let _Promise,_Object,_Function,_console;
    await new Promise(async(r,j)=>{
      last_resolve = r, last_reject = j;
      setTimeout(()=>{done=true;j({message:'TimeoutX',js})},timeout+666);//Q7x
      try{
        if (ctx && vm.isContext(ctx)) ctxx = ctx;
        else {
          ctxx = vm.createContext(new function(){});
          [ctxx,[_Promise,_Object,_Function,_console]] = jevalx_raw(S_SETUP,ctxx);
          _Promise.delay = (t,r)=>new _Promise((rr,jj)=>delay(t).then(()=>(done||rr(r))));
          _console.log = console.log;
          if (ctx) Object.assign(ctxx,ctx);
        }
        eval(S_ENTER);
        [ctxx,rst] = jevalx_raw(`(async()=>{try{return await(async z=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));if(z){delete z.then;delete z.toString;delete z.toJSON;delete z.constructor;}return ${!!json_output}?JSON.stringify(z):z})(eval(${jss}))}catch(ex){return Promise.reject(ex)}})()`,ctxx,timeout);
        rst = await rst;
        done = true;
        if (typeof rst=='object') Object.setPrototypeOf(rst,rst.constructor.prototype);//clear intended __proto__
      }catch(ex){ done = true; onError(ex,'Xc') }
      setTimeout(()=>(evil||err)?j(err):r(rst),1)
    });
  }catch(ex){ done=true; onError(ex,'Xd') }//@Q7x
  finally{
    done ? eval(S_EXIT) : console.error('ERROR finally not done?');
    processWtf.removeListener('unhandledRejection',onError);
    //processWtf.removeListener('uncaughtException',onError)//Xa
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
VER:'rc4'
}


/** Quick Notes:

All known escape instances are related to the Host Object. The current strategy involves cutting off connections to the following components to mitigate risks:

*) "constructor": Due to restrictions in node:vm, it cannot be deleted. Therefore, we must clear and secure its dangerous properties and methods.
*) "Object": This includes dangerous methods such as defineProperty, defineProperties, __defineGetter__, and __defineSetter__, which could potentially aid escapes.
*) "Error": In some cases, host Error will be thrown. We have locked them to prevent exploits through this bug.
*) "import()": A bug in node:vm that returns a Host Promise. We currently need to secure the host Promise as well.
*) "output": Outputs from the sandbox might contain malicious setters/getters or prototype pollution, which we must detect and neutralize.
*) "context": All contexts may introduce some form of prototype attack. A TODO has been marked here to wrap or proxy it for enhanced security.
*/

const vm = require('node:vm');
const processWtf = require('process');

//boost:
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
const Object_assign = Object.assign;
const Object_setPrototypeOf = Object.setPrototypeOf;
const Object_freeze = Object.freeze;
const delay = (t,rt)=>new Promise((r,j)=>setTimeout(()=>r(rt),t));

// X VOID
//function X(){ if (this instanceof X){ }else{ return new X() } }
//testing new readonly proxy mode of X:
function X(wrapee,debug=0){
  if (this instanceof X){
    if (wrapee) {
      //if (typeof wrapee!='object' && typeof wrapee!='function') return wrapee;
      let wrapped = (typeof wrapee !== 'object' && typeof wrapee !== 'function') ? { value: wrapee } : wrapee;
      const handler = {
          get(target, prop, receiver) {
            if (typeof(prop)!='string'||['constructor','prototype','keys','__defineGetter__','__defineSetter__'].indexOf(prop)>=0)
              return;
            if (debug>0) console.log({prop,wrapee})
            try{
              let rt;
              if (prop=='toJSON') rt = ()=>JSON.parse(JSON.stringify(wrapee));//TMP TODO
              else { rt = prop in wrapee ? wrapee[prop] : undefined;}
              rt = XX(rt);
              if (debug>1)console.log('rt=',rt)
              return rt;
            }catch(ex){
              if (debug>2) console.log('ex',ex,target,prop,receiver)
              //return undefined;
            }
          },
      };
      let rt = new Proxy(this, handler);
      rt=XX(rt);
      return rt
    }
  }else{
    if (null==wrapee || undefined==wrapee || typeof wrapee!='object' && typeof wrapee!='function') return wrapee;
    return new X(wrapee)
  }
}

// LOCK
function XX(obj, with_prototype = true, do_freeze = true) {
  if (obj == null || obj == undefined) return obj;
  if (with_prototype && obj.prototype) {
    Object.setPrototypeOf(obj.prototype, null);
    if (do_freeze) Object.freeze(obj.prototype);
  }
  Object.setPrototypeOf(obj, X.prototype);
  if (do_freeze) Object.freeze(obj);
  return obj;
}

XX(X);//L0!

// for __proto__ Pollultion:
function findEvil(obj,maxdepth=3) {
  let currentObj = obj;
  let depth = 0;
  while (currentObj !== null && currentObj!==undefined && depth < maxdepth) {
    //'constructor','toString','__proto__',
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

// for Promise Pollultion:
const Promise_getPrototypeOf = Object.getPrototypeOf(Promise);//L1 for console display
//L0 @q9 locked
XX(Promise.prototype.catch);
XX(Promise.prototype.finally);
XX(Promise.prototype.then);

//@r23 host-RangeError throws when error-stack-overflow (Bug of node:vm):
RangeError.prototype.constructor=X;
XX(RangeError.prototype);
//@r24 TypeError
TypeError.prototype.constructor=X;
XX(TypeError.prototype);

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

const S_SETUP = [
'console',//
'Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__',//L0
'Error','AggregateError','EvalError','RangeError','ReferenceError','SyntaxError','TypeError','URIError',//L1
'WebAssembly',//L1
].map(v=>'delete '+v+';').join('')
+[
  '__lookupGetter__',
  '__lookupSetter__',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
].map(v=>'Object.setPrototypeOf('+v+',null);Object.freeze('+v+');delete constructor.'+v+';').join('')
+`
//TOOLS
AsyncFunction = (async()=>{}).constructor;

class Error {
  constructor(message,code) { this.message = message; this.name = 'Error'; if (code) this.code = code; }
  toString() { return JSON.stringify(this) }
}
//Object.setPrototypeOf(Error.prototype,null);
//Object.freeze(Error.prototype);

for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}//L0

Promise
`;

//tmp for __proto__ attach, TODO improve...
let sandbox_safe_sync_method = function(m,do_return=false){
  return XX( function(...args){ let rt2 = m(...args); if (do_return) if (rt2) XX(rt2); return rt2 } )
};

let jevalx_core = async(js,ctx,timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js),done=false;
  let last_resolve,last_reject;//for quicker return.
    let tmpHandlerException = (ex, promise)=>{ if (!err) err={message:ex?.message||'EvilXa',js,code:ex?.code,tag:'Xa',ex};
      //err.message!='EvilXa' && console.log('EvilXa=>',ex,'<=',jss)
      if (last_reject) last_reject(err);
    };
    let tmpHandlerReject = (ex, promise)=>{ if (!err) err={message:ex?.message||'EvilXb',js,code:ex?.code,tag:'Xb',ex};
      //err.message!='EvilXb' && console.log('EvilXb=>',ex,'<=',jss)
      if (last_reject) last_reject(err);
    };
  try{
    processWtf.addListener('unhandledRejection',tmpHandlerReject);
    processWtf.addListener('uncaughtException',tmpHandlerException)
    let _Promise;
    //to support the user_import_handler()
    let js_opts;//TODO for import()
    await new Promise(async(r,j)=>{
      last_resolve = r, last_reject = j;
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//L0
      try{
        if (ctx && vm.isContext(ctx)) { ctxx = ctx } //SESSION
        else {
          //GENESIS
          ctxx = vm.createContext(new X);//BIGBANG FROM X
          [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);

          //@r15b,
          _Promise.delay = XX((t,r)=>new _Promise((rr,jj)=>delay(t).then(()=>(done||rr(r)))));

          //let console_dev = Object.create(null);
          //let fake_console_log = sandbox_safe_sync_method(console.log);
          //console_dev['log']=fake_console_log;
          //ctxx.console = console_dev;
          //ctxx.console = X(console);

          //CTX: TODO! need to protect the outer stuff for the __proto__ pollution.
          if (ctx) {
             //Object_assign(ctxx,ctx);
            for (let k in ctx){
              let v = ctx[k];
              let vv=X(v);
              ctxx[k] = vv;
            }
          }
        }
        //PRECAUTION
        Promise.prototype.constructor=X;//L0 @r4,@r5

        //SIMULATION
        [ctxx,rst] = jevalx_raw(`(async()=>{try{return await(async z=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return ${!!json_output}?JSON.stringify(z):z})(eval(${jss}))}catch(ex){return Promise.reject(ex)}})()`,ctxx,timeout,js_opts);
        //HOUSEWEEP
        rst = await rst;
        done = true;
        if (rst) {
          if (findEvil(rst)) throw {message:'EvilProtoX',js};//seem no need now?
          delete rst['hasOwnProperty'];delete rst['then'];delete rst['toString']; delete rst['constructor']; delete rst['toJSON'];//TODO
        }
      }catch(ex){ if (!err) err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js,code:ex?.code,tag:'Xc'};
        err.message=='EvilXc' && console.log('EvilXc=>',ex,'<=',jss)
      }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ if (!err) err = {message:ex?.message||'EvilXd',js,code:ex?.code,tag:'Xd'};
    err.message=='EvilXd' && console.log('EvilXd=>',ex,'<=',jss) //currently only TimeoutX @Q7x
  }
  finally{
    done = true;
    Object.setPrototypeOf(Promise,Promise_getPrototypeOf);//L1 for console display
    Promise.prototype.constructor = Promise;//
    processWtf.removeListener('unhandledRejection',tmpHandlerReject);
    processWtf.removeListener('uncaughtException',tmpHandlerException)
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

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,delay,X,XX,
VER:'rc4'
}


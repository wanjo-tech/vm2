const vm = require('node:vm');
const processWtf = require('process');

// X LIKE VOID
function X(){ if (this instanceof X){ }else{ return new X() } }
X.prototype.constructor = X;
Object.setPrototypeOf(X.prototype,null);
Object.freeze(X.prototype);
//if (X.__proto__) Object.setPrototypeOf(X.__proto__,null);//L1
Object.setPrototypeOf(X,null);//L0
Object.freeze(X);//L0

//boost:
const console_log = console.log;
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
const Object_assign = Object.assign;

//Host tools
const delay = (t,rt)=>new Promise((r,j)=>setTimeout(()=>r(rt),t));
//for dev/debug e.g. jevalx(`dump(this)`,{console:{log:console.log},props:Object.getOwnPropertyNames,dump})
//TODO dumptree()
function dump(obj) {
    let props = [];
    let currentObj = obj;
    do {
        props = props.concat(Object_getOwnPropertyNames(currentObj));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));

    return props.sort().filter(function(e, i, arr) { 
       if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
    });
}


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
const Promise___proto__ = Promise.__proto__;
const Promise___proto___apply = Promise.__proto__.apply;
const Promise___proto___then = Promise.__proto__.then;
const Promise_prototype_finally = Promise.prototype.finally;
const Promise_prototype_catch = Promise.prototype.catch;
const Promise_prototype_then = Promise.prototype.then;
const Promise_getPrototypeOf = Object.getPrototypeOf(Promise);
Object.setPrototypeOf(Promise,null);///protect Host Promise

//@r23 for Host RangeError throws when error-stack-overflow (Bug of node:vm):
RangeError.prototype.constructor=undefined;
Object.freeze(RangeError.prototype);

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

//const S_FUNCTION = "(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";

const S_SETUP = [
'console',//it is not working
'Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__',
].map(v=>'delete '+v+';').join('')
//IMPORTANT: need to lock the danger functions of 'this'
+[
//  '__defineGetter__',
//  '__defineSetter__',
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

for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}//L0

Promise
`;

//tmp for __proto__ attach, clean later.. TODO...
let sandbox_safe_method = function(m,do_return=false){
  let rt = function(...args){ let rt = m(...args); if (do_return) return rt }
  Object.setPrototypeOf(rt.prototype,null);
  Object.freeze(rt.prototype);
  Object.setPrototypeOf(rt,null);
  Object.freeze(rt);
  //console.log('sandbox_safe_method',rt);
  return rt;
};

let jevalx_core = async(js,ctx,timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js);
  let last_resolve,last_reject;//for quicker return.
    let tmpHandlerException = (ex, promise)=>{ if (!err) err={message:ex?.message||'EvilXa',js,code:ex?.code,tag:'Xa'};
      //err.message!='EvilXa' &&
      console.log('EvilXa=>',ex,'<=',jss)
      if (last_reject) last_reject(err);
    };
    let tmpHandlerReject = (ex, promise)=>{ if (!err) err={message:ex?.message||'EvilXb',js,code:ex?.code,tag:'Xb'};
      //err.message!='EvilXb' &&
      console.log('EvilXb=>',ex,'<=',jss)
      if (last_reject) last_reject(err);
    };
  try{
    processWtf.addListener('unhandledRejection',tmpHandlerReject);
    processWtf.addListener('uncaughtException',tmpHandlerException)
    let _Promise;
    //support the user_import_handler()
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      if (!evil && !err){
        if (user_import_handler) { return user_import_handler({specifier, referrer, importAttributes}) }
        if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
      }
      evil++; err = {message:'EvilImport',js};
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      last_resolve = r, last_reject = j;
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV TEST...
      try{
        if (ctx && vm.isContext(ctx)) { ctxx = ctx } //SESSION
        else {
          //GENESIS
          ctxx = vm.createContext(new X);//BIGBANG FROM X
          [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);
          let _Promise_resolve = _Promise.resolve;//@r21.
          let fake_delay = async function(t,r){ await delay(t); return _Promise_resolve(r) }
          Object.setPrototypeOf(fake_delay,null);
          Object.freeze(fake_delay);
          _Promise.delay = fake_delay;

          let console_dev = Object.create(null);
          let fake_console_log = sandbox_safe_method(console.log);
          console_dev['log']=fake_console_log;
          ctxx.console = console_dev;
          if (ctx) Object_assign(ctxx,ctx);//CTX: TODO! need to protect the outer stuff for the __proto__ pollution.
        }
        //PRECAUTION
        ////Host Promise (TODO moved higer level later>)
        Object.setPrototypeOf(Promise.prototype.catch,null);
        Object.freeze(Promise.prototype.catch);
        Object.setPrototypeOf(Promise.prototype.finally,null);
        Object.freeze(Promise.prototype.finally);
        Object.setPrototypeOf(Promise.prototype.then,null);
        Object.freeze(Promise.prototype.then);
        Promise.prototype.constructor=X;//L0
        Object.setPrototypeOf(Promise.prototype,null);//L0 for cleariing the __proto__
        Object.freeze(Promise.prototype);//L0 for the import("").catch()

        //SIMULATION
        [ctxx,rst] = jevalx_raw(`(async()=>{try{return await(async z=>{while(z&&((z instanceof Promise)&&(z=await z)||(typeof z=='function')&&(z=z())));return ${!!json_output}?JSON.stringify(z):z})(eval(${jss}))}catch(ex){return Promise.reject(ex)}})()`,ctxx,timeout,js_opts);
        //SIMULATION}}}

        //HOUSEWEEP
        rst = await rst;
        if (rst) {
          if (findEvil(rst)) throw {message:'EvilProtoX',js};//seem no need now?
          delete rst['toString']; delete rst['constructor']; delete rst['toJSON'];//not sure, TODO?
        }
      }catch(ex){ if (!err) err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js,code:ex?.code,tag:'Xc'};
        //err.message=='EvilXc' &&
        console.log('EvilXc=>',ex,'<=',jss)
      }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ if (!err) err = {message:ex?.message||'EvilXd',js,code:ex?.code,tag:'Xd'};
    //err.message=='EvilXd' &&
    console.log('EvilXd=>',ex,'<=',jss)
  }
  finally{
    Object.setPrototypeOf(Promise,Promise_getPrototypeOf);
    Promise.prototype.catch = Promise.prototype.catch;//
    Promise.prototype.then = Promise_prototype_then;//
    Promise.prototype.finally = Promise_prototype_finally;//
    Promise.prototype.constructor = Promise;
    if (Promise.__proto__){ Promise.__proto__.constructor=Function; }
    //Object.prototype.constructor=Object;//no need any more now?
    processWtf.removeListener('unhandledRejection',tmpHandlerReject);
    processWtf.removeListener('uncaughtException',tmpHandlerException)
  }
  if (err) {
    if (err?.code=='ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG') err.message = 'EvilImportX';
    if (err?.code=='ERR_SCRIPT_EXECUTION_TIMEOUT') err.message = 'Timeout'+timeout;
    if (!err?.time) err.time = new Date().getTime();//for app
    if (!err?.id) err.id = err.time;//for app
  }
  if (evil || err) throw err;
  if (return_ctx) return [ctxx,rst];
  return rst;
}
let jevalx = jevalx_core;

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,delay,X,dump}


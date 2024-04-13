const vm = require('node:vm');
const processWtf = require('process');

//boost:
const console_log = console.log;
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
const getOwnPropertyNames = Object_getOwnPropertyNames;
const Object_assign = Object.assign;

// for __proto__ Pollultion:
function findEvil(obj,maxdepth=3) {
  let currentObj = obj;
  let depth = 0;
  while (currentObj !== null && currentObj!==undefined && depth < maxdepth) {
    //'constructor','toString','__proto__',
    const properties = ['constructor','then'];//Object_getOwnPropertyNames(currentObj);
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
const Promise_prototype_catch = Promise.prototype.catch;
const Promise_prototype_then = Promise.prototype.then;
const Promise_getPrototypeOf = Object_getPrototypeOf(Promise);

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

//const S_FUNCTION = "(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";

const S_SETUP = [
  'console','Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'
].map(v=>'delete '+v+';').join('')
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
].map(v=>'Object.setPrototypeOf('+v+',null);delete constructor.'+v+';').join('')
+`
delete constructor.__proto__.__proto__.constructor;
delete constructor.__proto__.__proto__.__defineGetter__;
delete constructor.__proto__.__proto__.__defineSetter__;
delete constructor.__proto__.constructor;
Object.setPrototypeOf(constructor.prototype,null);
delete constructor.prototype;
Object.setPrototypeOf(constructor,null);
Object.freeze(constructor);
Object.freeze(Function.__proto__);
//Object.freeze(Function);
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}
Promise
`;

//tmp for __proto__ attach, clean later..
let sandbox_safe_method = function(m,do_return=false){
  let rt = function(...args){ let rt = m(...args); if (do_return) return rt }
Object.setPrototypeOf(rt,null);
Object.freeze(rt);
//console.log('sandbox_safe_method',rt);
  return rt;
};

let jevalx_dev = async(js,ctx,timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0,jss= JSON.stringify(js);
  let tmpHandlerReject = (ex, promise)=>{ if (!err) err={message:'EvilXb',js};
    //err.message!='EvilXb' &&
    console.log('EvilXb=>',ex,'<=',jss)
  };
  let tmpHandlerException = (ex, promise)=>{ if (!err) err={message:'EvilXa',js};
    //err.message!='EvilXa' &&
    console.log('EvilXa=>',ex,'<=',jss)
  };
  try{
    processWtf.addListener('unhandledRejection',tmpHandlerReject);
    processWtf.addListener('uncaughtException',tmpHandlerException)
    //support the user_import_handler()
    let _Promise;
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      if (!evil && !err){
        if (user_import_handler) { return user_import_handler({specifier, referrer, importAttributes}) }
        if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
      }
      evil++; err = {message:'EvilImport',js};
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV TEST...
      try{
        //GENESIS
        ctxx = vm.createContext(new function(){});//BIGBANG
        [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);//INIT
        //NOETS: everyhing came from ctx will have a protential attack, need to improve solution later.
        //ctxx.console = {log:sandbox_safe_method(console.log),props:sandbox_safe_method(getOwnPropertyNames)};//DEV
        let console_dev = Object.create(null);
        console_dev['log']=sandbox_safe_method(console.log);
        ctxx.console = console_dev;

        //ctxx.console = {log:console.log,props:getOwnPropertyNames};//FOR TMP DEV ONLY !!

        _Promise.prototype.catch = function(){
//console.log('!!!!!!!!! 888 check catch',this instanceof _Promise,this);
return new _Promise((r,j)=>{ Promise_prototype_catch.call(this,error=>j(error))}); };
        _Promise.delay = sandbox_safe_method((t,rt)=>new _Promise((r,j)=>setTimeout(()=>j(rt),t)),true);
        _Promise.prototype.then= function(){
//console.log('!!!!!!!!! 888 inner check then',this instanceof _Promise);
return new _Promise((r,j)=>{ Promise_prototype_then.call(this,error=>j(error))}); };
        _Promise.delay = sandbox_safe_method((t,rt)=>new _Promise((r,j)=>setTimeout(()=>r(rt),t)),true);

        if (ctx) Object_assign(ctxx,ctx);//CTX
        //PROTECT
        Promise.prototype.catch = function(){
//console.log('!!!!!!!!! outer check catch',this instanceof _Promise);
return new _Promise((r,j)=>{ Promise_prototype_catch.call(this,error=>j(error))}); };
        Promise.prototype.then = function(){
//         console.log('!!!!!!!!!!! outer then',this instanceof _Promise);
          return new _Promise((r,j)=>{ Promise_prototype_then.call(this,error=>j(error))});
        };
        //WORLD
        [ctxx,rst] = await jevalx_raw(`new Promise(async(resolve,reject)=>{ try{ var rst = eval(${jss}); for (let i=0;i<9;i++){ if (!rst) break; if (rst instanceof Promise) {
try{
rst = await Promise.race([
//(async()=>{try{await Promise.delay(${timeout},{message:'Timeout${timeout}'})}catch(ex){}})(),
Promise.delay(${timeout},{message:'Timeout${timeout}'}),
rst
]);
}catch(ex){
  reject(ex)
}
} else if (typeof rst=='function') rst = await rst(); else break; } if (rst instanceof Promise || typeof rst=='function') { return reject('EvilCall'); } resolve( ${json_output}?JSON.stringify(rst):rst); }catch(ex){ reject(ex) } })`,ctxx,timeout,js_opts); }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js};
        //err.message=='EvilXc' &&
        console.log('EvilXc=>',ex,'<=',jss)
      }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilXd',js};
    //err.message=='EvilXd' &&
    console.log('EvilXd=>',ex,'<=',jss)
  }
  finally{
    Object.setPrototypeOf(Promise,Promise_getPrototypeOf);
    Promise.__proto__.constructor=Function;
    Object.prototype.constructor=Object;
    processWtf.removeListener('unhandledRejection',tmpHandlerReject);
    processWtf.removeListener('uncaughtException',tmpHandlerException)
  }
  if (evil || err) throw err;
  if (return_ctx) return [ctxx,rst];
  return rst;
}
let jevalx = jevalx_dev;
let jevalx_core = jevalx_dev;

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,S_SETUP,jevalx_dev}

/**
NOTES: list hidden method of ...
function getAllPrototypeMethods(obj) {
    let props = [];
    let currentObj = obj;
    do {
        props = props.concat(Object.getOwnPropertyNames(currentObj));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));

    return props.sort().filter(function(e, i, arr) { 
       if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
    });
}
console.log(getAllPrototypeMethods(constructor));
*/
//let jevalx_core = async(js,ctx,timeout=666,json_output=false,return_ctx=false,user_import_handler=undefined)=>{
//  let ctxx,rst,err,evil=0,jss= JSON.stringify(js);
//  let tmpHandlerReject = (ex, promise)=>{ if (!err) err={message:'EvilXb',js};
//    err.message!='EvilXb' && console.log('EvilXb=>',ex,'<=',jss)
//  };
//  let tmpHandlerException = (ex, promise)=>{ if (!err) err={message:'EvilXa',js};
//    err.message!='EvilXa' && console.log('EvilXa=>',ex,'<=',jss)
//  };
//  try{
//    processWtf.addListener('unhandledRejection',tmpHandlerReject);
//    processWtf.addListener('uncaughtException',tmpHandlerException)
//    //support the user_import_handler()
//    let _Promise;
//    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
//      if (!evil && !err){
//        if (user_import_handler) { return user_import_handler({specifier, referrer, importAttributes}) }
//        if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
//      }
//      evil++; err = {message:'EvilImport',js};
//      throw('EvilImport');
//    }});
//    await new Promise(async(r,j)=>{
//      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV TEST...
//      try{
//        //GENESIS
//        ctxx = vm.createContext(new function(){});//BIGBANG
//        [ctxx,_Promise] = jevalx_raw(S_SETUP,ctxx);//INIT
//        ctxx.console = {log:console.log,props:getOwnPropertyNames};//DEV
//        ctxx.setTimeout= setTimeout;//DEV
//        if (ctx) Object_assign(ctxx,ctx);//CTX
//        //OVERRIDE
//        Promise.prototype.catch = function(){
//          return new _Promise((r,j)=>{ Promise_prototype_catch.call(this,error=>j(error))});
//        };
//        //WORLD
//        [ctxx,rst] = jevalx_raw(js,ctxx,timeout,js_opts);
//        let sandbox_level = 9;
//        for (var i=0;i<sandbox_level;i++) {
//          //console_log('debug',i,rst);
//          if (evil || !rst || err) break;
//          //if (findEvil(rst)) throw {message:'EvilProto',js};
//          if ('function'==typeof rst) {//run in the sandbox !
//            ctxx['rst']=rst;
//            [ctxx,rst] = jevalx_raw('(()=>rst())()',ctxx,timeout,js_opts);
//          }else if (rst.then){
//            rst = await new Promise(async(r,j)=>{
//              setTimeout(()=>j({message:'Timeout',js}),timeout);
//              try{ r(await rst) } catch(ex) { j(ex) };
//            });
//          } else break;
//        }
//        if (rst) {
//          if (json_output){
//            ctxx['rst'] = rst;
//            rst = jevalx_raw('JSON.stringify(rst==this?{}:rst)',ctxx,timeout,js_opts)[1]; //do inside...
//            rst = JSON.parse(rst);
//          }else{
//            if (findEvil(rst)) throw {message:'EvilProtoX',js};
//            //delete rst['toString']; //delete rst['__proto__']; //delete rst['constructor'];
//          }
//        }
//      }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilXc'),js};
//        err.message=='EvilXc' && console.log('EvilXc=>',ex,'<=',jss)
//      }
//      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
//    });
//  }catch(ex){ err = {message:ex?.message||'EvilXd',js};
//    err.message=='EvilXd' && console.log('EvilXd=>',ex,'<=',jss)
//  }
//  finally{
//    Object.setPrototypeOf(Promise,Promise_getPrototypeOf);
//    Promise.__proto__.constructor=Function;
//    Object.prototype.constructor=Object;
//    processWtf.removeListener('unhandledRejection',tmpHandlerReject);
//    processWtf.removeListener('uncaughtException',tmpHandlerException)
//  }
//  if (evil || err) throw err;
//  if (return_ctx) return [ctxx,rst];
//  return rst;
//}

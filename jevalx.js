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
const Promise___proto___apply = Promise.__proto__.apply;
const Promise___proto___then = Promise.__proto__.then;
const Promise_prototype_catch = Promise.prototype.catch;
const Promise_getPrototypeOf = Object_getPrototypeOf(Promise);
//const Promise_prototype = Promise.prototype;
//const Promise_prototype_getPrototypeOf = Object_getPrototypeOf(Promise.prototype);

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

const S_FUNCTION = "(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";

const S_SETUP = `
//delete Object.prototype.constructor;

`+[
//'eval',//RC2: set it free for testing...
'Function',//L0
//'Promise',//set free now.
'console',//no use at all, user can attach console from host.
'Symbol','Reflect','Proxy','Object.prototype.__defineGetter__','Object.prototype.__defineSetter__'//L0
].map(v=>'delete '+v+';').join('') 
+`
Function=${S_FUNCTION};//very important.

//L0 protect constructor:
delete constructor.__proto__.__proto__.constructor;
delete constructor.__proto__.__proto__.__defineGetter__;
delete constructor.__proto__.__proto__.__defineSetter__;
constructor.__proto__.constructor=Function;

Object.__proto__.constructor=Function;//L1

//L0 remove vulnerable Object[at]sandbox methods
for(let k of Object.getOwnPropertyNames(Object)){if(['name','fromEntries','keys','entries','is','values','getOwnPropertyNames'].indexOf(k)<0){delete Object[k]}}

//tools
AsyncFunction=(async()=>0).constructor;
`;

const jevalx_ext = (js,ctx,timeout=666,js_opts)=>{
  let rst,ctxx;
  fwd_eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];
  if (!ctx || !vm.isContext(ctx)){
    ctxx = vm.createContext(new function(){});
    ctxx.console_log = console.log;//for dev test only
    [ctxx,rst] = jevalx_raw(S_SETUP,ctxx);
    //ctxx.setTimeout= setTimeout;//for dev test only
    //ctxx.eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];//rc2: seems no need anymore
    if (ctx) Object_assign(ctxx,ctx);
  }else{ ctxx = ctx; }
  return jevalx_raw(js,ctxx,timeout,js_opts)
}

let jevalx_core = async(js,ctx,timeout=666,json_output=true,user_import_handler=undefined)=>{
  let ctxx,rst,err,evil=0;
  let tmpHandlerReject = (ex, promise)=>{ if (!err) err={message:'EvilXb',js,uncaughtException:false};
typeof(ex)!='string' && ex?.message && console.log('999b=>\n',ex,'\n<=',JSON.stringify(js))
};
  let tmpHandlerException = (ex, promise)=>{ if (!err) err={message:'EvilXa',js,uncaughtException:true};
typeof(ex)!='string' && ex?.message && console.log('999a=>\n',ex,'\n<=',JSON.stringify(js))
};
  processWtf.addListener('unhandledRejection',tmpHandlerReject);
  processWtf.addListener('uncaughtException',tmpHandlerException)
  try{
    Promise.prototype.catch = function(){
      if (Promise.__proto__.apply !== Promise___proto___apply) {
        console.log('EvilDebug 777 catch 110',evil,err);
        Promise.__proto__.apply = Promise___proto___apply;
      }
      if (evil || err) { //TODO already error?
        console.log('EvilDebug 777 catch 111',evil,err);
      }
      return Promise_prototype_catch.call(this,error=>{ err = error; });
    };
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
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV TEST...
      try{
        [ctxx,rst] = jevalx_ext(js,ctx,timeout,js_opts);
        let sandbox_level = 9;
        for (var i=0;i<sandbox_level;i++) {
          //console_log('debug',i,rst);
          if (evil || !rst || err) break;
          //if (findEvil(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {//run in the sandbox !
            ctxx['rst']=rst;
            [ctxx,rst] = jevalx_ext('(()=>rst())()',ctxx,timeout,js_opts);
          }else if (rst.then){
            rst = await new Promise(async(r,j)=>{
              setTimeout(()=>j({message:'Timeout',js}),timeout);
              try{ r(await rst) } catch(ex) { j(ex) };
            });
          } else break;
        }
        if (rst) {
          if (json_output){
            ctxx['rst'] = rst;
            rst = jevalx_ext('JSON.stringify(rst)',ctxx,timeout,js_opts)[1]; //do inside...
            rst = JSON.parse(rst);
          }else{
            delete rst['toString'];
            delete rst['__proto__'];
            delete rst['constructor'];
            if (findEvil(rst)) throw {message:'EvilProtoX',js};
          }
        }
      }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilUnknown'),js};
typeof(ex)!='string' && ex?.message && console.log('999c=>\n',ex,'\n<=',JSON.stringify(js))
}
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilXX',js}; }
  finally{
    /* reset Promise for pollution */
    if (Promise___proto___then != Promise.__proto__.then){
      console.log('reset Promise___proto___then 114');
      Promise.__proto__.then = Promise___proto___then;
    }
    if (Promise.__proto__.apply !== Promise___proto___apply) {
      console.log('reset Promise___proto___apply 113');
      Promise.__proto__.apply = Promise___proto___apply;
    }
    Promise.prototype.catch = Promise_prototype_catch;//
    Object.setPrototypeOf(Promise,Promise_getPrototypeOf);//important for the __proto__ polution.
    Promise.__proto__.constructor=Function;//

    processWtf.removeListener('unhandledRejection',tmpHandlerReject);
    processWtf.removeListener('uncaughtException',tmpHandlerException)
  }
  if (evil || err) throw err;
  return rst;
}
var jevalx = jevalx_core;

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,jevalx_ext,S_SETUP}


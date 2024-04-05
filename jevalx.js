const processWtf = require('process');
const setTimeoutWtf=setTimeout;
const PromiseWtf=Promise;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const ObjectWtf = Object;
const Object_keys = Object.keys;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertySymbols = Object.getOwnPropertySymbols;
const Object_defineProperty = Object.defineProperty;
const Object_defineProperties = Object.defineProperties;
const Object_freeze = Object.freeze;
const Object_assign = Object.assign;

const Object_hasOwnProperty = Object.hasOwnProperty;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;

const Promise_prototype_then = Promise.prototype.then;
const vm = require('node:vm');
function findEvilGetter(obj,deep=3) {
  let currentObj = obj;
  let i=0;
  while (currentObj !== null) {
    if (i>2) return true;//found if too deep
    const descriptor = Object_getOwnPropertyDescriptor(currentObj, 'then');
    if (descriptor && typeof descriptor.get === 'function') {
      return descriptor.get; // Stop if the 'then' getter is found
    }
    currentObj = Object_getPrototypeOf(currentObj); // Move up the prototype chain
  }
  return false;
}
//we are sandbox(run js inside ctx) instead of vm(full function), remove everything vulnerable!!
const prejs_delete = [
  'process',//L0
  'Object.getPrototypeOf','Object.defineProperties','Object.defineProperty','Object.getOwnPropertySymbols','Object.freeze',//L0
  'Proxy','Reflect',//L0
  'Object.assign',//L0
  //'eval',
  //'require',
  'Object.prototype.__defineGetter__',//L2
  'Object.prototype.__defineSetter__',//L2
  //'Promise',
  //'Function',
  'Symbol','Error',
].map(w=> `delete ${w};`).join('');
let throwx=e=>{throw(e)}
var jevalx_core = async(js,ctx,timeout=666)=>{
  let rst,err,evil=0,done=false,warnings=[];
  let tmpHandler = (reason, promise)=>{err={message:''+reason,js}};
  processWtf.addListener('unhandledRejection',tmpHandler);
  let Wtf={};
  try{
    for(let k of[...Object_keys(globalThis),...['process','require']]){if(globalThis[k]){Wtf[k]=globalThis[k];delete globalThis[k]}};

    //should not allow sandbox have these://L0
    delete Object.prototype.__defineGetter__;
    delete Object.prototype.__defineSetter__;
    delete Object.freeze;
    delete Object.defineProperties;
    delete Object.defineProperty;
    delete Object.getPrototypeOf;
    delete Object.getOwnPropertySymbols;
    delete Object.assign;

    process = undefined;//L0

    await new PromiseWtf(async(r,j)=>{
      try{
        let sandbox_level=9;//
        ctx = ctx || {};//no empty
        //ctx.console_log = console.log;//for dev-tmp
        let ctxx = vm.createContext(ctx);//
        vm.createScript(prejs_delete).runInContext(ctxx);//prepare
        rst = vm.createScript(js,{importModuleDynamically(specifier, referrer, importAttributes){
          evil++; err = {message:'EvilImport',js};globalThis['process'] = undefined;
        }}).runInContext(ctxx,{breakOnSigint:true,timeout});
        for (var i=0;i<sandbox_level;i++) {
          if (evil || !rst || err) break;
          ////PromiseWtf.prototype.then = Promise_prototype_then;//important for Promise hack.
          if (findEvilGetter(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {//run in the sandbox !
            ctxx['rst_tmp']=rst;
            rst = vm.createScript('rst_tmp()'
                ,{importModuleDynamically(specifier, referrer, importAttributes){
              evil++; err = {message:'EvilImport',js};globalThis['process'] = undefined;
            }}).runInContext(ctxx,{breakOnSigint:true,timeout});
          }else if (rst.then){
            rst = await new PromiseWtf(async(r,j)=>{
              setTimeoutWtf(()=>j({message:'Timeout',js}),timeout);
              try{ r(await rst) } catch(ex) { j(ex) };
            });
          } else break;
        }
        if (rst){
          (rst==globalThis)&&throwx({message:'EvilGlobal',js});

          //quick concept prove, will clean up later...
          for (let k of Object_getOwnPropertyNames(rst)){
            if (k=='toString' || k =='then'){
              warnings.push({[k]:rst[k]})
              //console.log('!!! DEBUG TODO evil.',k,rst[k]);
              delete rst[k];
            }
          }
          //console.log('DEBUG Object_getOwnPropertyNames',Object_getOwnPropertyNames(rst));

          findEvilGetter(rst)&&throwx({message:'EvilProto',js});
          (rst.then)&&throwx({message:'EvilPromiseX',js});
          ('function'==typeof(rst))&&throwx({message:'EvilFunction',js});
        }
      }catch(ex){ err = {message:ex?.message||'EvilUnknown',js}}
      setTimeoutWtf(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilX',js} }

  processWtf.removeListener('unhandledRejection',tmpHandler);
  for(var k in Wtf){globalThis[k]=Wtf[k]};

  Object = ObjectWtf;//L0
  Object.getOwnPropertySymbols = Object_getOwnPropertySymbols;
  Object.defineProperty = Object_defineProperty;
  Object.defineProperties = Object_defineProperties;
  Object.getPrototypeOf = Object_getPrototypeOf;
  Object.freeze = Object_freeze;
  Object.assign = Object_assign;

  Promise = PromiseWtf;
  PromiseWtf.prototype.then = Promise_prototype_then;//important for Promise hack.

  //change design, now caller to jevalx_core() have own decision:
  return [(evil||err)?undefined:rst,(evil||err)?err:undefined,warnings.length>0?warnings:undefined];

  //if (evil || err) throw err;
  //return rst;
}

var jevalx = async(js,ctx,timeout)=>{
  var [rst,err,warnings] = await jevalx_core(js,ctx,timeout);
  if (warnings) { console.log('warnings',warnings); }
  if (err) throw err;
  return rst;
}

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core}

//let tmpObject = undefined;
//try{Object_defineProperty(globalThis,'Object',{get(k){ return undefined},set(o){ throw 'EvilObject' }})}catch(ex){console.log('Object_defineProperty',ex)}



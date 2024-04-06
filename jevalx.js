const vm = require('node:vm');
const console_log = console.log;
const Object_keys = Object.keys;

const Object_getOwnPropertySymbols = Object.getOwnPropertySymbols;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_defineProperty = Object.defineProperty;
const Object_defineProperties = Object.defineProperties;
const Object_freeze = Object.freeze;
const Object_assign = Object.assign;

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
let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>{
  //console.log('jevalx_raw',js);
  if (!vm.isContext(ctxx||{})) { ctxx = vm.createContext(ctxx||{}); }
  return [ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})]
}
const throwx=e=>{throw(e)}
let jevalx_core = async(js,ctx,timeout=666)=>{

  let ctxx,_;
  [ctxx,_] = jevalx_raw(`(()=>{delete eval;delete Function; delete Reflect; delete Proxy; delete Symbol; })();`,ctx);

  //attach tools:
  Object_assign(ctxx,{
eval:(js)=>jevalx_raw(js,ctxx,timeout)[1],console_log,
Symbol:(...args)=>{throw {message:'TodoSymbol'}},
Reflect:(...args)=>{throw {message:'TodoReflect'}},
Proxy:(...args)=>{throw {message:'TodoProxy'}},
});

  //house-sweeping
  let sFunction="(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";
  [ctxx,_] = jevalx_raw(`(()=>{
Function=${sFunction};
constructor.__proto__.constructor=Function;
delete constructor.prototype.__defineSetter__;
delete constructor.prototype.__defineGetter__;
constructor.__proto__.constructor=Function;
Object.freeze(constructor.__proto__.constructor);

delete constructor.defineProperties;
delete constructor.defineProperty;
delete constructor.getPrototypeOf;
delete constructor.getOwnPropertySymbols;
delete constructor.assign;

if (constructor.freeze!==Object.freeze){ delete constructor.freeze; }
Object.freeze(constructor);

delete Object.prototype.__defineGetter__;
delete Object.prototype.__defineSetter__;
delete Object.defineProperties;
delete Object.defineProperty;
delete Object.getPrototypeOf;
delete Object.getOwnPropertySymbols;
delete Object.assign;
delete Object.freeze;
  })()`,ctxx);

  let rst,err,evil=0,done=false,warnings=[];
  let tmpHandler = (reason, promise)=>{err={message:''+reason,js}};
  process.addListener('unhandledRejection',tmpHandler);
  try{
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      //TODO make some fake import in future...or put it in the args by caller...
      console_log('TODO EvilImport',{importAttributes});
      evil++; err = {message:'EvilImport',js};
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV ONLY...
      try{
        [ctxx,rst] = jevalx_raw(js,ctxx,timeout,js_opts);
        let sandbox_level = 9;
        for (var i=0;i<sandbox_level;i++) {
          //console_log('debug',i,rst);
          if (evil || !rst || err) break;
          if (findEvilGetter(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {//run in the sandbox !
            ctxx['rst_tmp']=rst;
            [ctxx,rst] = jevalx_raw('()=>{let rt=rst_tmp;delete rst_tmp;return rst_tmp()}',ctxx,timeout,js_opts);
          }else if (rst.then){
            rst = await new Promise(async(r,j)=>{
              setTimeout(()=>j({message:'Timeout',js}),timeout);
              try{ r(await rst) } catch(ex) { j(ex) };
            });
          } else break;
        }
      }catch(ex){err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilUnknown'),js}}
      setTimeout(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilX',js};/* console_log('EvilX',ex)*/ }
  process.removeListener('unhandledRejection',tmpHandler);
  if (evil || err) throw err;
  return rst;
}
var jevalx = jevalx_core;
var jevalx_dev = jevalx_core;
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,jevalx_dev}


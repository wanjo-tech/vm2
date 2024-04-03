//As sandbox, we just need the js run in ctx, remove as much as we can if vulnerable

const processWtf = typeof(process)=='undefined'?undefined:process;
const setTimeoutWtf=setTimeout,PromiseWtf=Promise;
const PromiseWtf_prototype_then = PromiseWtf.prototype.then;//for dirty patch
const Object_keys = Object.keys;
const Object_defineProperty = Object.defineProperty;
const Object_defineProperties = Object.defineProperties;

const Object_prototype___defineGetter__ = Object.prototype.__defineGetter__;

//NOTES: level 0
// jammed all vulnerable import() in the promise-hell:
// in node:vm, something might be reset, so need to delete inside runInContext:
const prejs = ['eval','process','Symbol','Promise','Error','Proxy','Reflect','Function',
      'Object.getPrototypeOf','Object.defineProperties','Object.defineProperty','Object.getOwnPropertySymbols',
      'Object.prototype.__proto__','Object.prototype.__defineGetter__'].map(w=>`delete ${w};`).join('');
var jevalx_core = async(js,ctx,timeout=60000,More=['process','eval','require','Reflect','Function','Proxy'],vm=require('node:vm'))=>{
  let rst,err,evil=false,done=false;
  let tmpHandler = (reason, promise)=>{ err = {message:''+reason,js};console.log(110)};
  processWtf.addListener('unhandledRejection',tmpHandler);

  let Wtf={};
  try{
    for(let k of[...Object_keys(globalThis),...More]){if(globalThis[k]){Wtf[k]=globalThis[k];
      globalThis[k] = undefined;//testing
      delete globalThis[k];//not good?
    }}
    Object.prototype.__defineGetter__=undefined;//very important
    //Object.defineProperty = undefined;
    //Object.defineProperties = undefined;
    //delete process;//NO!!!
    //process = undefined;//important!!! NOT 'delete process' !!!
    //let checkProto = (rst)=>{
    //  if (!!rst) {
    //    if (!!(rst.__proto__) && Object_keys(rst.__proto__).length>0) {
    //      //console.log('!!!! __proto__ attack?', [typeof rst, rst.constructor,rst, rst.__proto__],'<=',JSON.stringify(js));
    //      throw {message:'EvilProtoX',js};
    //    }
    //    delete rst.then;//
    //  }
    //}
    await new PromiseWtf(async(r,j)=>{
      try{
        rst = vm.createScript(prejs+js,{importModuleDynamically(specifier, referrer, importAttributes){
            evil=true; err = {message:'EvilImport',js}; globalThis['process'] = undefined;//very important! NOT 'delete process'
        }}).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout});
        if (!!rst) {
          if (!!(rst.__proto__) && Object_keys(rst.__proto__).length>0) {
            //console.log('!!!! __proto__ attack?', [typeof rst, rst.constructor,rst, rst.__proto__],'<=',JSON.stringify(js));
            throw {message:'EvilProto',js};
          }
          delete rst.then;//
        }
        Promise = PromiseWtf;
        Promise.prototype.then = PromiseWtf_prototype_then;//dirty patch. find better way later.
        if(rst==globalThis) throw {message:'EvilGlobal',js};
        if ('function'==typeof rst){
          rst = await rst();
          if (!!rst) {
            if (!!(rst.__proto__) && Object_keys(rst.__proto__).length>0) {
              throw {message:'EvilProtoX',js};
            }
            delete rst.then;//
          }
        }
        if (rst instanceof PromiseWtf){ throw {message:'EvilPromise'}}
        if ('function'==typeof rst){ throw {message:'EvilFunction'} }
      }catch(ex){ err = (ex&&ex.message) ? ex:{message:'Evil',ex,js}}
      Promise = PromiseWtf;
      Promise.prototype.then = PromiseWtf_prototype_then;//dirty patch. find better way later.
      setTimeoutWtf(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },0);
    });
  }catch(ex){ err = (ex&&ex.message) ? ex:{message:'EvilX',ex,js} }
  processWtf.removeListener('unhandledRejection',tmpHandler);

  Object.defineProperties = Object.defineProperties;
  Object.defineProperty = Object.defineProperty;
  Object.prototype.__defineGetter__=Object_prototype___defineGetter__;
  for(var k in Wtf){globalThis[k]=Wtf[k]};
  //process = processWtf;
  if (evil || err) { throw err }
  return rst;
}

var jevalx = jevalx_core;

//Stronger dose!!! Once jevalx_core passed all test, this one is no longer needed.
//const ProxyWtf=Proxy,ErrorWtf=Error,ObjectWtf = Object,ReflectWtf = Reflect, FunctionWtf = Function;
//var jevalx = async(js,ctx,timeout=60000,More=['process','eval','require','Reflect','Function','Proxy'])=>{
//  //TODO seems no need any more
//  let the_process;
//  try{Object.defineProperty(globalThis,'process',{get(k){ return the_process},set(o){ the_process=o}})}catch(ex){}
//
//  let rst,err;
//  try{
//    rst = await jevalx_core(js,ctx,timeout);
//  }catch(ex){ err = ex&&ex.message ? ex : {message:'EvilSandbox',js} }
//  return new PromiseWtf((r,j)=>setTimeoutWtf(async()=>{
//    //Object = ObjectWtf;
//    //Function = FunctionWtf;
//    //for(var k in Wtf){globalThis[k]=Wtf[k]};
//    //Promise=PromiseWtf;Error=ErrorWtf;Proxy=ProxyWtf;
//    //Promise.prototype.then = PromiseWtf_prototype_then;//dirty patch. find better way later.
//    //process = processWtf;
//    if (err) j(err); else r(rst);
//  },0));
//};

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core}


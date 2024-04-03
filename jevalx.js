//As sandbox, we just need the js run in ctx, remove as much as we can if vulnerable

const processWtf = typeof(process)=='undefined'?undefined:process;
const setTimeoutWtf=setTimeout,PromiseWtf=Promise;
const PromiseWtf_prototype_then = PromiseWtf.prototype.then;//for dirty patch
const Object_keys = Object.keys;
const Object_defineProperty = Object.defineProperty;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_defineProperties = Object.defineProperties;
const Object_prototype___defineGetter__ = Object.prototype.__defineGetter__;
const Object_prototype___proto__ = Object.prototype.__proto__;
const delay = (t)=>new PromiseWtf(r=>setTimeoutWtf(r,t));

//NOTES: level 0
// jammed all vulnerable import() in the promise-hell:
// in node:vm, something might be reset, so need to delete inside runInContext:
const prejs_delete = [
  'eval','process','Object.getPrototypeOf','Object.defineProperties','Object.defineProperty','Object.getOwnPropertySymbols',
  'Promise','Proxy','Reflect','Function',
  'Object.prototype.__proto__',
  'Object.prototype.__defineGetter__'
].map(w=> `delete ${w};`).join('');
const prejs_undefined = [].map(w=> `${w}=undefined;`).join('');
var jevalx_core = async(js,ctx,timeout=60000,timeout_race=666,More=['process','eval','require','Reflect','Function','Proxy',],vm=require('node:vm'))=>{
  let rst,err,evil=false,done=false;
  let tmpHandler = (reason, promise)=>{ err = {message:''+reason,js}};
  processWtf.addListener('unhandledRejection',tmpHandler);

  let Wtf={};
  try{
    for(let k of[...Object_keys(globalThis),...More]){if(globalThis[k]){Wtf[k]=globalThis[k];
      //globalThis[k] = undefined;//testing
      delete globalThis[k];
    }};
    delete Object.prototype.__defineGetter__;//
    //delete Object.prototype.__proto__;//
    await new PromiseWtf(async(r,j)=>{
      try{
        rst = vm.createScript(prejs_delete+prejs_undefined+'\n'+js,{importModuleDynamically(specifier, referrer, importAttributes){
          evil=true; err = {message:'EvilImport',js}; globalThis['process'] = undefined;//very important! NOT 'delete process'
        }}).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout});
        if(rst==globalThis) throw {message:'EvilGlobal',js};
        for (var i=0;i<7;i++) {
          if (!rst) break;
          let __proto__ = Object_getPrototypeOf(rst);
          if (Object_keys(__proto__||[]).length>0) {
            //console.log('!!! DEBUG __proto__',__proto__,rst,Object_keys(__proto__||[]));
            throw {message:'EvilProto',js};
          } else
          if ('function'==typeof rst) {
            rst = rst();
          }else if (rst.then){
            if (rst instanceof PromiseWtf){//outside Promise
              rst = await rst;
            }else if ((''+rst)=='[object Promise]'){//Sandbox Promise. dirty, will improve later.
              rst = await PromiseWtf.race([
                  (async()=>{try{return await rst;}catch(ex){console.log(ex)}})(),
                  delay(timeout_race) ]);
            }else{
              throw {message:'EvilPromise',js}
            }
          } else {
            break;
          }
        }
        if (rst && rst.then){ throw {message:'EvilPromiseX',js} }
        if ('function'==typeof rst){
          throw {message:'EvilFunction',js}
          //err = {message:'EvilFunction',js}
          rst = undefined;
        }
      }catch(ex){ err = (ex&&ex.message) ? ex:{message:'Evil',ex,js}}
      Promise = PromiseWtf;
      Promise.prototype.then = PromiseWtf_prototype_then;//dirty patch. find better way later.
      //Object.prototype.__proto__ = Object_prototype___proto__;
      Object.prototype.__defineGetter__ = Object_prototype___defineGetter__;
      setTimeoutWtf(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },1);
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
//  },1));
//};

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core}


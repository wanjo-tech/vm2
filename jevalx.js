//sandbox: we just need the js run in ctx, remove thinks if vulnerable.

const processWtf = typeof(process)=='undefined'?undefined:process;
const setTimeoutWtf=setTimeout,PromiseWtf=Promise;
const Object_keys = Object.keys;
const Object_getPrototypeOf = Object.getPrototypeOf;
//const Object_defineProperty = Object.defineProperty;
//const PromiseWtf_prototype_then = PromiseWtf.prototype.then;//for dirty patch

const prejs_delete = [
  'eval','process',
  'Object.getPrototypeOf','Object.defineProperties','Object.defineProperty','Object.getOwnPropertySymbols',
  'Promise','Proxy','Reflect','Function',
].map(w=> `delete ${w};`).join('');
var jevalx_core = async(js,ctx,timeout=60000,timeout_race=666,vm=require('node:vm'))=>{
  let rst,err,evil=false,done=false;
  let tmpHandler = (reason, promise)=>{ err = {message:''+reason,js}};
  processWtf.addListener('unhandledRejection',tmpHandler);

  let Wtf={};
  try{
    for(let k of[...Object_keys(globalThis),...['process','require']]){if(globalThis[k]){Wtf[k]=globalThis[k]};delete globalThis[k]};
    delete Object.prototype.__defineGetter__;//important!!
    await new PromiseWtf(async(r,j)=>{
      try{
        rst = vm.createScript(prejs_delete+'\n'
          +js,{importModuleDynamically(specifier, referrer, importAttributes){
            evil=true; err = {message:'EvilImport',js};
            globalThis['process'] = undefined;//very important! NOT delete.
        }}).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout});
        if(rst==globalThis) throw {message:'EvilGlobal',js};
        for (var i=0;i<9;i++) {
          if (!rst) break;
          let __proto__ = Object_getPrototypeOf(rst);
          if (Object_keys(__proto__||[]).length>0) {
            throw {message:'EvilProto',js};
          } else if ('function'==typeof rst) {
            rst = rst();
          }else if (rst.then){
            if (rst instanceof PromiseWtf){//host Promise
              //rst = await rst;
              throw {message:'EvilPromiseHost',js}
            }else if ((''+rst)=='[object Promise]'){//sandbox Promise. dirty, will improve later...
              rst = await new PromiseWtf(async(r,j)=>{
                setTimeoutWtf(()=>j({message:'Timeout',timeout_race}),timeout_race);
                try{ r(await rst) } catch(ex) { j(ex) };
              });
            }else throw {message:'EvilPromise',js}
          } else break;
        }
        if (rst && rst.then) throw {message:'EvilPromiseX',js};
        if ('function'==typeof rst) throw {message:'EvilFunction',js};
      }catch(ex){ err = (ex&&ex.message) ? ex:{message:'EvilUnknown',ex,js}}
      setTimeoutWtf(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },1);
    });
  }catch(ex){ err = (ex&&ex.message) ? ex:{message:'EvilX',ex,js} }

  processWtf.removeListener('unhandledRejection',tmpHandler);
  for(var k in Wtf){globalThis[k]=Wtf[k]};
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


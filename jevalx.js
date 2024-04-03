const processWtf = require('process');
const setTimeoutWtf=setTimeout;
const PromiseWtf=Promise;
const Object_keys = Object.keys;
const Object_getPrototypeOf = Object.getPrototypeOf;
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
            globalThis['process'] = undefined;//very important! NOT delete..
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
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core}

const processWtf = typeof(process)=='undefined'?undefined:process;
const setTimeoutWtf=setTimeout,PromiseWtf=Promise,ProxyWtf=Proxy,ErrorWtf=Error;
const PromiseWtf_prototype_then = PromiseWtf.prototype.then;//
const ObjectWtf = Object;//
const ReflectWtf = Reflect, FunctionWtf = Function;
const Object_keys = Object.keys;

//NOTES: jammed all import() in the promise-hell:
var _jevalx = async(js,ctx,timeout=60000,More=['process','eval','require','Reflect','Function'],vm=require('node:vm'))=>{
  let rst,err,evil=false,done=false;
  try{
    process = undefined;
    await new PromiseWtf((r,j)=>{
      try{
        rst = vm.createScript('delete process;delete eval;delete Promise;delete Error;delete Proxy;delete Reflect;delete Function;delete Object.getPrototypeOf;delete Object.defineProperty;delete Object.defineProperties;delete Object.getOwnPropertySymbols;delete Object.prototype.__proto__;delete Object.prototype.__defineGetter__;'+//NOTES: works until new spoil case.
          js,{importModuleDynamically(specifier, referrer, importAttributes){
            //console.log('found evil',evil,'done',done,typeof(globalThis['process']),'js=',js);
            evil=true;
            err = {message:'EvilImport',js};
            globalThis['process'] = undefined;//important
          }}).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout});
      }catch(ex){ err = (ex&&ex.message) ? {message:ex.message}:{message:'Evil',ex,js} }
      //if(rst!==null && rst!==undefined){ delete rst.then; }
      Promise = PromiseWtf;
      Promise.prototype.then = PromiseWtf_prototype_then;//dirty patch. find better way later.
      setTimeoutWtf(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },1);
    });
  }catch(ex){ err = (ex&&ex.message) ? {message:ex.message}:{message:'EvilX',ex,js} }
  process = processWtf;
  if (evil || err) { throw err }
  return rst;
}

//as sandbox, we just need the js run in ctx, remove as much as we can if vulnerable:
var jevalx = async(js,ctx,timeout=60000,More=['process','eval','require','Reflect','Function'],vm=require('node:vm'))=>{
  let Wtf={};
  for(let k of[...Object_keys(globalThis),...More]){if(globalThis[k]){Wtf[k]=globalThis[k];delete globalThis[k]}}

  //inspired by @j4k0xb:
  let the_process;
  try{Object.defineProperty(globalThis,'process',{get(k){ return the_process},set(o){ the_process=o}})}catch(ex){}

  delete Promise;delete Error;delete Proxy;delete process;delete Reflect;
  if (typeof Object!='undefined'){ // WILL BE CLEAN UP AFTER ALL CONCEPT PROVES
    delete Object.prototype.__defineGetter__;//
    //delete Object.prototype.__proto__;//
    //Object.prototype.__proto__=undefined;
    //delete Object.prototype.constructor;//
    //delete Object.prototype.getPrototypeOf;
    //delete Object.prototype.defineProperty;
    delete Object.getOwnPropertySymbols;
    delete Object.getPrototypeOf;
    delete Object.defineProperty;
    delete Object.defineProperties;
    //delete Object;
  }
  delete Array.prototype.__proto__;//
  delete Array.prototype.constructor;//
  delete Function;

  let rst,err,evil=false,done=false;
  try{
    rst = await _jevalx(js,ctx,timeout);

    if(rst==globalThis) rst = {message:'EvilGlobal',js};
    if (rst instanceof PromiseWtf) rst = await rst;
    if ('function'==typeof rst){ rst = {message:'EvilFunction'} }

  }catch(ex){ err = ex&&ex.message ? {message:ex.message,js} : {message:'EvilSandbox',js} }
  return new PromiseWtf((r,j)=>setTimeoutWtf(async()=>{
    Object = ObjectWtf;
    Function = FunctionWtf;
    for(var k in Wtf){globalThis[k]=Wtf[k]};
    Promise=PromiseWtf;Error=ErrorWtf;Proxy=ProxyWtf;
    Promise.prototype.then = PromiseWtf_prototype_then;//dirty patch. find better way later.
    process = processWtf;
    done = true;
    if (err) j(err); else r(rst);
  },0));
};

if (typeof module!='undefined') module.exports = {jevalx,_jevalx}


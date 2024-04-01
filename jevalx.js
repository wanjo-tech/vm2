const processWtf = typeof(process)=='undefined'?undefined:process;
const setTimeoutWtf=setTimeout,PromiseWtf=Promise,ProxyWtf=Proxy,ErrorWtf=Error;
const PromiseWtf_prototype_then = PromiseWtf.prototype.then;//
const ObjectWtf = Object;//
const ReflectWtf = Reflect, FunctionWtf = Function;
const Object_keys = Object.keys;
var jevalx = async(js,ctx,timeout=60000,More=['process','eval','require','Reflect','Function'],vm=require('node:vm'))=>{
  let Wtf={};
  for(let k of[...Object_keys(globalThis),...More]){Wtf[k]=globalThis[k];delete globalThis[k]}

  //inspired by @j4k0xb:
  let the_process;
  try{Object.defineProperty(globalThis,'process',{get(k){ return the_process},set(o){ the_process=o}})}catch(ex){}

  //as sandbox, we just need the js run in ctx, remove as much as we can if vulnerable:
  delete Promise;delete Error;delete Proxy;delete process;delete Reflect;
  if (typeof Object!='undefined'){
    delete Object.prototype.__proto__;//
    delete Object.prototype.constructor;//
    //delete Object.prototype.getPrototypeOf;
    //delete Object.prototype.defineProperty;
    delete Object.getPrototypeOf;
    delete Object.defineProperty;
    //delete Object;
  }
  delete Array.prototype.__proto__;//
  delete Array.prototype.constructor;//
  delete Function;

  let rst,err,evil=false;
  try{
    rst = await new PromiseWtf(async(r,j)=>{
      try{
        rst = vm.createScript('delete eval;delete Promise;delete Error;delete Proxy;delete Reflect;delete Function;delete Object.getPrototypeOf;delete Object.defineProperty;'+//NOTES: works until new spoil case.
          js,{importModuleDynamically(specifier, referrer, importAttributes){evil=true;globalThis['process'] = undefined}
        }).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout})
        if (evil){ return j({message:'EvilImport',js}) }
        if(rst==globalThis) rst = {message:'EvilGlobal',js};
        let typeof_rst = typeof(rst);

        //inspired by @XmiliaH: .then is vulnerable:
        if(rst){ delete rst.then }

        if (rst instanceof PromiseWtf) rst = await rst;
        if ('function'==typeof rst){ rst = {message:'EvilFunction'} }
      }
      catch(ex){ err = ex&&ex.message ? {message:ex.message} : {message:'EvilSandbox',js} }
      if (err) j(err); else r(rst);
    })
  }catch(ex){ err = ex }
  return new PromiseWtf(async(r,j)=>setTimeoutWtf(()=>{
    Object = ObjectWtf;
    Function = FunctionWtf;
    for(var k in Wtf){globalThis[k]=Wtf[k]};
    Promise=PromiseWtf;Error=ErrorWtf;Proxy=ProxyWtf;
    Promise.prototype.then = PromiseWtf_prototype_then;//dirty patch. find better way later.
    if (err) j(err); else r(rst);
  },1));
};

if (typeof module!='undefined') module.exports = {jevalx}


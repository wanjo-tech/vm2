const processWtf = require('process');
const setTimeoutWtf=setTimeout;
const PromiseWtf=Promise;
//const FunctionWtf = Function;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const Object_keys = Object.keys;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertySymbols = Object.getOwnPropertySymbols;
const Object_defineProperty = Object.defineProperty;
const Object_defineProperties = Object.defineProperties;

const Promise_prototype_then = Promise.prototype.then;
const vm = require('node:vm');
function findEvilGetter(obj,deep=3) {
  let currentObj = obj;
  let i=0;
  while (currentObj !== null) {
    if (i>2) return true;//assure found if too deep
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
  'eval','process',
  'Object.getPrototypeOf','Object.defineProperties','Object.defineProperty','Object.getOwnPropertySymbols',
  //'Object.prototype.getPrototypeOf','Object.prototype.defineProperties','Object.prototype.defineProperty','Object.prototype.getOwnPropertySymbols',
  'Promise','Proxy','Reflect','Function','Symbol','Error',
].map(w=> `delete ${w};`).join('');
var jevalx_core = async(js,ctx,timeout=666)=>{
  let rst,err,evil=false,done=false;
  let tmpHandler = (reason, promise)=>{err={message:''+reason,js}};
  processWtf.addListener('unhandledRejection',tmpHandler);
  let Wtf={};
  try{
    for(let k of[...Object_keys(globalThis),...['process','require']]){if(globalThis[k]){Wtf[k]=globalThis[k]};delete globalThis[k]};

    delete Object.prototype.__defineGetter__;//important!!
    delete Object.defineProperties;//important
    delete Object.defineProperty;//important
    delete Object.getPrototypeOf;//
    delete Object.getOwnPropertySymbols;//

    process = undefined;
    Promise = undefined;
    //Function = undefined;

    await new PromiseWtf(async(r,j)=>{
      try{
        let sandbox_level = 9;//
        let ctxx = vm.createContext(ctx||{});//
        //vm.createScript(prejs_delete).runInContext(ctxx);//some cleanup
        rst = vm.createScript(prejs_delete+`\n`
            +js,{importModuleDynamically(specifier, referrer, importAttributes){
          evil=true; err = {message:'EvilImport',js};globalThis['process'] = undefined;
        }}).runInContext(ctxx,{breakOnSigint:true,timeout});
        for (var i=0;i<sandbox_level;i++) {
          if (evil || !rst || err) break;
          PromiseWtf.prototype.then = Promise_prototype_then;//important for Promise hack.
          if (findEvilGetter(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {
            //rst = rst();//security breach if run in this context
            //tmp solution, improve later!
            ctxx['rst']=rst;
            //rst = vm.createScript(prejs_delete+`\n`+'rst()'
            //    ,{importModuleDynamically(specifier, referrer, importAttributes){
            //  //console.log('EvilImport',{specifier,referrer});
            //  evil=true; err = {message:'EvilImport',js};globalThis['process'] = undefined;
            //}}).runInContext(vm.createContext({...ctx||{},...{rst}}),{breakOnSigint:true,timeout});
            rst = vm.createScript('rst()'
                ,{importModuleDynamically(specifier, referrer, importAttributes){
              evil=true; err = {message:'EvilImport',js};globalThis['process'] = undefined;
            }}).runInContext(ctx,{breakOnSigint:true,timeout});
          }else if (rst.then){
            if ( rst instanceof PromiseWtf || (''+rst)=='[object Promise]'){//sandbox Promise. dirty, will improve later...
              rst = await new PromiseWtf(async(r,j)=>{
                setTimeoutWtf(()=>j({message:'Timeout',timeout}),timeout);
                try{ r(await rst) } catch(ex) { j(ex) };
              });
            }else throw {message:'EvilPromise',js}
          } else break;
        }
        PromiseWtf.prototype.then = Promise_prototype_then;//important for Promise hack.
        if (findEvilGetter(rst)) { throw {message:'EvilProto',js} }
        if (rst && rst.then) throw {message:'EvilPromiseX',js};
        if ('function'==typeof rst) throw {message:'EvilFunction',js};
        if(rst==globalThis) throw {message:'EvilGlobal',js};
      }catch(ex){ err = {message:ex?.message||'EvilUnknown',js}}
      setTimeoutWtf(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilX',js} }

  processWtf.removeListener('unhandledRejection',tmpHandler);
  for(var k in Wtf){globalThis[k]=Wtf[k]};
  Object.getOwnPropertySymbols = Object_getOwnPropertySymbols;
  Object.defineProperty = Object_defineProperty;
  Object.defineProperties = Object_defineProperties;
  Object.getPrototypeOf = Object_getPrototypeOf;

  //Function = FunctionWtf;
  Promise = PromiseWtf;
  PromiseWtf.prototype.then = Promise_prototype_then;//important for Promise hack.
  if (evil || err) throw err;
  return rst;
}
//var jevalxx = (js,ctx={},timeout=666)=>jevalx_core(`evalx(${JSON.stringify(js)},ctx)`,{evalx:jevalx_core,ctx},timeout);
var jevalxx = async(js,ctx={},timeout=666)=>await vm.createScript(`evalx(${JSON.stringify(js)},ctx)`).runInContext(vm.createContext({evalx:jevalx_core,ctx}),{breakOnSigint:true,timeout});
//var jevalxx = async(js,ctx={},timeout=666)=>{
//  let rst,err;
//  let tmpHandler = (reason, promise)=>{err={message:''+reason,js}};
//  processWtf.addListener('unhandledRejection',tmpHandler);
//  rst = await vm.createScript(`evalx(${JSON.stringify(js)},ctx)`).runInContext(vm.createContext({evalx:jevalx_core,ctx}),{breakOnSigint:true,timeout});
//  processWtf.removeListener('unhandledRejection',tmpHandler);
//  if (err) throw err
//  return rst;
//};
var jevalx = jevalxx;
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalxx}

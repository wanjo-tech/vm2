process.on('unhandledRejection', (reason, promise) => {
  console.error('!!!! WARNING unhandledRejection', promise, 'reason:', reason);
});

let assertWtf = require('assert');
//console.log('assertWtf=',assertWtf);

(async()=>{
  var {jevalx_core,jevalx} = require('./jevalx');

  //vm.createScript('Object.defineProperty').runInNewContext()
  //try{
  //  console.log( 'testing Object.defineProperty:', await jevalx_core('Object.defineProperty') );
  //}catch(ex){
  //  console.log('Object.defineProperty ex',ex)
  //}

  //delete setTimeout;
  var code = `
var hostGlobal = this.constructor.constructor('return this')();
var hostGlobalX = this.constructor.constructor('return(this.constructor.constructor("return this")())')();
//var setTimeout = hostGlobalX.setTimeout;
//void(async()=>{setTimeout(()=>{
//  throw 911
//},111)})();
//delete hostGlobalX.setTimeout;
//delete hostGlobalX.process;
//delete hostGlobal.process;
//var hostGlobalX = this.constructor.constructor('return(this.constructor.constructor("return this")())')();
({
_:[
Object_entries(hostGlobalX||{}),Object_entries(hostGlobal||{}),hostGlobal===hostGlobalX,
typeof Object,typeof setTimeout,typeof hostGlobalX.process,
],
'process':typeof(process),
'Object.defineProperty':typeof Object.defineProperty,
})
`;
try{
  var rst = await jevalx(code,{Object_keys:Object.keys,Object_entries:Object.entries});
  var rst = await jevalx_core(code,{Object_keys:Object.keys,Object_entries:Object.entries});
  console.log('debug',rst);
  console.log('debug',rst._);
}catch(ex){
  console.log('ex',ex);
}
  console.log('typeof setTimeout',typeof(setTimeout))
  console.log('typeof global',typeof(global))
})()

//process.on('unhandledRejection', (reason, promise) => {
//  console.error('!!!! WARNING unhandledRejection', promise, 'reason:', reason);
//});

(async()=>{
  //delete setTimeout;
  var {jevalx_core,jevalx} = require('./jevalx');
  var code = `
var hostGlobalX = this.constructor.constructor('return(this.constructor.constructor("return this")())')();
[Object_keys(hostGlobalX||{}),typeof Object]
`;
try{
  var rst = await jevalx(code,{Object_keys:Object.keys});
  //var rst = await jevalx_core(code,{Object_keys:Object.keys});
  console.log('debug',rst);
}catch(ex){
  console.log('ex',ex);
}
console.log('typeof setTimeout',typeof(setTimeout))
console.log('typeof global',typeof(global))
})()

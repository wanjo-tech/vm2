process.on('unhandledRejection', (reason, promise) => {
  console.error('!!!! WARNING unhandledRejection', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => { console.log('Uncaught exception:', error); });


let vm = require('node:vm');

let vm2 = (js,ctx,timeout=999,vm=require('node:vm'))=>{
    return vm.createScript(js,{importModuleDynamically(specifier, referrer, importAttributes){
            evil=true; err = {message:'EvilImport',js}; globalThis['process'] = undefined;//very important! NOT 'delete process'
    }}).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout});
}

(async()=>{
//console.log('start end game');
//var code=`(async()=>({then:()=>{}}))()`
//var rst = await eval(code);
})()
.then(async()=>{
  //var {jevalx} = require('./jevalx');
  //var code = `(async()=>{ return ({ then:()=>{} }) })() `;
  //var code = `(async()=>({then:()=>{}}))()`;
  var code = `(async()=>{await(async()=>({then:()=>{}}))()})()`;

  console.log({code})
  //await jevalx(code)
  //await vm2(code);//will die!!!
  var rst = await vm2(code);
  //try{
  //  //rst = rst.then(1,0);
  //  //rst = await rst;//die...
  //}catch(ex){
  //console.log('ex',ex)
  //}
  console.log('still see tomorrow?',rst,rst.then);
})();

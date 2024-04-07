process.on('unhandledRejection', (reason, promise) => {
  console.error('!!!! WARNING unhandledRejection', promise, 'reason:', reason);
});

try{
  const vm = require('node:vm');

  console.log('test deadloop in bun')
  let timeout=666;
  let ctxx = vm.createContext(new(function Object(){}));
  //the bun will hang here, but nodejs working good with timeout err.
  var rst =vm.createScript(`while(1)0`).runInContext(ctxx,{breakOnSigint:true,timeout})
  console.log('rst',rst);
}
catch(ex){ console.log('deadloop.ex',ex); }


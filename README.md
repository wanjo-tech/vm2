

# Replacement for the very unfriendly management discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

I've tried to send them the replacement solution for the vulnerable of constructor.constructor issue.

But their really bad manner just pissing me off.

Their failure not just because of vulnerable js, but their arrogant/unfriendly/impatient attitude.

I post the hide-and-seek solution here for your referece here. Wish you a good day.

```
var jevalx = async(js,ctx,timeout=60000,More=['process','Symbol','Error','eval','require'],vm=require('node:vm'),Wtf={})=>{
  for(let k of[...Object.keys(globalThis),...More]){Wtf[k]=globalThis[k];delete globalThis[k]}
  try{return await vm.createScript(js).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout})}
  catch(ex){throw ex}finally{for(var k in Wtf){globalThis[k]=Wtf[k]};}
};
```

## test cases

good to expected "process is not defined".  passed most vulnerable cases, while I'm stilling looking for new ones, please let me know if any.

```
(async() => {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('WARNING unhandledRejection', promise, 'reason:', reason);
  });
  var rst = await jevalx("this.constructor.constructor(`(async()=>{})().then(()=>{process.mainModule.require('fs').writeFileSync('pwned','')})`)();");
})();
```

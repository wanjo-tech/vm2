# vm2

Replacement for the very unfriendly management discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

I've tried to send them the replacement solution for the vulnerable of constructor.constructor issue.

But their really bad manner just pissing me off.

I post the hide-and-seek solution here for you referece here. Wish you a good day.

```
var jevalx = async(js,ctx,timeout=60000,More=['process','Symbol','Error','eval','require'],vm=require('node:vm'),Wtf={})=>{
  for(let k of[...Object.keys(globalThis),...More]){Wtf[k]=globalThis[k];delete globalThis[k]}
  try{return await vm.createScript(js).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout})}
  catch(ex){throw ex}finally{for(var k in Wtf){globalThis[k]=Wtf[k]};}
};
```

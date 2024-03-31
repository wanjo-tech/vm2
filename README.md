

# Replacement for the very unfriendly management discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

I've tried to send them the replacement solution for the vulnerable of constructor.constructor issue.

But their really bad manner just pissing me off.

Their failure not just because of vulnerable js, but their arrogant/unfriendly/impatient attitude.

I post the hide-and-seek solution here for your referece here. Wish you a good day.

(round continued 2024-03-31):
```
var jevalx = async(js,ctx,timeout=60000,More=['process','Promise','Symbol','Error','eval','require'],vm=require('node:vm'))=>{
  let Wtf={};
  const PromiseWtf = Promise;
  const processWtf = process;
  for(let k of[...Object.keys(globalThis),...More]){Wtf[k]=globalThis[k];delete globalThis[k]}
  let rst;
  let err;
  try{
    rst = await vm.createScript('delete Promise;delete Symbol;'+js).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout})}
  catch(ex){ err=ex; }
  finally{
    return new PromiseWtf((r,j)=>{
      for(var k in Wtf){globalThis[k]=Wtf[k]};
      globalThis['process'] = processWtf;
      globalThis['Promise'] = PromiseWtf;
      if (err) j(err); else r(rst)
    });
  }
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

//test a:
(async()=>{
  let code = `void (async() => {
  await Promise.resolve();
  await Promise.resolve();
  this.constructor
    .constructor("return process")()
    .mainModule.require("fs")
    .writeFileSync("pwneda", "");
  })()`;
  try{
    console.log('AAAA result',await jevalx(code));
  }catch(ex){
    console.log('AAAA ex',ex);
  }
  console.log('AAAA confirm process is still here',typeof(process));
})().then(async()=>{ //test b:
  var code=`
    const customInspectSymbol = Symbol.for({
      toString: () => "nodejs.util.inspect.custom",
    });

    throw {
      [customInspectSymbol]: () => {
        this.constructor
          .constructor("return process")()
          .mainModule.require("fs")
          .writeFileSync("pwnedb", "");
      },
    }
  `;
  try{
    console.log('BBBBB result',await jevalx(code));
  }catch(ex){
    console.log('BBBB ex',''+ex);
  }
  console.log('BBBB confirm process is still here',typeof(process),typeof globalThis['process']);
})

```



# Replacement for the very unfriendly management discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

I've tried to send them the replacement solution for the vulnerable of constructor.constructor issue.

But their really bad manner just pissing me off.

Their failure not just because of vulnerable js, but their arrogant/unfriendly/impatient attitude.

I post the hide-and-seek solution here for your referece here. Wish you a good day.

The plan is simple, hide before call and recover when done.  Might be dirty but it is useful when sandbox still needed for projects.

(round continued 2024-03-31):

```
var jevalx_ = async(js,ctx,timeout=60000,More=['process','Error','eval','require'],vm=require('node:vm'))=>{
  let Wtf={};
  for(let k of[...Object.keys(globalThis),...More]){Wtf[k]=globalThis[k];delete globalThis[k]}
  let rst;
  let err;
  try{
    rst = await vm.createScript(js).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout})
  }catch(ex){ console.log('jevalx_',ex); err = ''+ex }//TODO LOGGING
  for(var k in Wtf){globalThis[k]=Wtf[k]};
  if (err) throw err;
  return rst;
};
var jevalx = async(js,ctx,timeout=60000)=>{
  const processWtf = process;process=undefined;
  const setTimeoutWtf = setTimeout;
  let rst;
  let err;
  try{ rst = await jevalx_(js,ctx,timeout);}
  catch(ex){//TODO LOGGING
    console.log('jevalx.ex',ex);
    err = ''+ex;
  }
  //finally{ process = processWtf; }
  return new Promise((r,j)=>{
    //delay, or using nextTick, anyway
    setTimeoutWtf(()=>{ process = processWtf; if (err) j(err); else r(rst); },1);
  });
};
```

## test cases

good to expected "process is not defined".  passed most vulnerable cases, while I'm stilling looking for new ones, please let me know if any.

```
(async()=>{
  console.log('--------- TEST START -----------');
})().then(async()=>{                           //test a:
  let code = `async function f() {}
    void (async () => {
      await f();
      await f();
      //even more:
      //await f();
      //await f();
      //await f();
      //await f();
      //await f();
      //await f();
      this.constructor
        .constructor("return process")()
        .mainModule.require("fs")
        .writeFileSync("pwneda", "");
    })();`;
  try{
    console.log('AAAA result=',await jevalx(code));
  }catch(ex){
    console.log('AAAA ex=',ex);
  }
  console.log('AAAA check=',typeof(process),typeof(Promise));
}).then(async()=>{ //test b:
  var code=`
    const Symbol= Object.getOwnPropertySymbols(Array)[0].constructor;
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
    console.log('BBBBB result=',await jevalx(code));
  }catch(ex){
    console.log('BBBB ex=',typeof ex,ex);
  }
  console.log('BBBB check=',typeof(process),typeof(Promise));
}).then(async()=>{
  console.log('--------- TEST END -----------');
});

```

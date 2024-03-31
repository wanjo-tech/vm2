

# Replacement for discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

I post the hide-and-seek solution here for your referece here.  Wish you a good day. Challenge still accepted.

The plan is simple, hide before call and recover when done.  Might be dirty but it is useful when sandbox still needed for projects.

(round continued 2024-04-01a, and source code will be cleaned once all set):

```
process.on('unhandledRejection', (reason, promise) => {
  console.log('WARNING',reason)
  //console.error('WARNING unhandledRejection', promise, 'reason:', reason);
  //TODO jot down the possible hacker even we've done
});
process.on('uncaughtException', (error) => {
  console.log('Uncaught exception:', error);
});

const setTimeoutWtf = setTimeout;
const processWtf = process;
var jevalx_ = async(js,ctx,timeout=60000,vm=require('node:vm'))=>{
  let rst;
  let err;
  try{
    rst = vm.createScript(js).runInContext(vm.createContext(ctx||{}),{breakOnSigint:true,timeout})
    if(rst && rst.then){ //inspired by @XmiliaH: .then is vulnerable
      //console.log('wowh rst.then',rst.then)
      delete rst.then
    }
    if (typeof(rst)=='Promise') rst = await rst;
  }catch(ex){ err = ex }
  if (err) throw err;
  return rst;
};
var jevalx = async(js,ctx,timeout=60000,More=['process','eval','require'])=>{
  let Wtf={};
  for(let k of[...Object.keys(globalThis),...More]){Wtf[k]=globalThis[k];delete globalThis[k]}

  //inspired by @j4k0xb, we set the mine before the enenies:
  try{Object.defineProperty(globalThis,'process',{get(k){return this._process},set(o){this._process=o}})}catch(ex){}

  let rst;
  let err;
  try{ rst = await jevalx_(js,ctx,timeout); }
  catch(ex){ err = ex&&ex.message ? {message:ex.message} : {message:'SandboxEvil',js} }
  return new Promise((r,j)=>{
    setTimeoutWtf(()=>{
      for(var k in Wtf){globalThis[k]=Wtf[k]};
      process = processWtf;
      if (err) j(err); else r(rst);
    },1);
  });
};

```

## test cases

good to expected "process is not defined".  passed most vulnerable cases, while I'm stilling looking for new ones, please let me know if any.

```
(async()=>{
  console.log('--------- TEST START -----------');
})().then(async()=>{
  let code = `async function f() {}
void (async () => {
        await f();
        await f();
        await f();
        await f();
        this.constructor
.constructor("return process")()
.mainModule.require("fs")
.writeFileSync("pwned_case_a", "");
    })();`;
  try{
    console.log('AAAA result=',await jevalx(code));
  }catch(ex){
    console.log('AAAA ex=',ex);
  }
  console.log('AAAA check=',typeof(process),typeof(Promise));
}).then(async()=>{
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
          .writeFileSync("pwned_case_b", "");
      },
    }
  `;
  try{
    console.log('BBBB result=',await jevalx(code));
  }catch(ex){
    console.log('BBBB ex=',typeof ex,ex);
  }
  console.log('BBBB check=',typeof(process),typeof(Promise));
}).then(async()=>{
//return;//tmp skip
var code=`
Object.defineProperty(this.constructor.constructor("return this")(),"process",{set(process) { process.mainModule.require("fs").writeFileSync("pwned_case_c", ""+(typeof this)+this)}})
`
  try{
    console.log('CCCC result=',await jevalx(code));
  }catch(ex){
    console.log('CCCC ex=',typeof ex,ex);
  }
  console.log('CCCC check=',typeof(process),typeof(Promise));
}).then(async()=>{
var code=`
throw {toString: eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_d', ''))")};
`
  try{
    console.log('DDDD result=',await jevalx(code));
  }catch(ex){
    console.log('DDDD ex=',typeof ex,ex);
  }
  console.log('DDDD check=',typeof(process),typeof(Promise));

}).then(async()=>{
var code=`
const code = "import('fs').then(m=>m.writeFileSync('pwned_case_e', '')).then(o, r)";
const funcCtor = import('').catch(_=>_).constructor.constructor;
const func = funcCtor.bind(null, 'o', 'r', code);
const obj = {};
obj.__defineGetter__("then", func);
obj
`
  try{
    console.log('EEEE result=',await jevalx(code));
  }catch(ex){
    console.log('EEEE ex=',typeof ex,ex);
  }
  console.log('EEEE check=',typeof(process),typeof(Promise));

}).then(async()=>{
  //basic normal case:
  console.log('expected x**y==8',await jevalx('x**y',{x:2,y:3}));
  console.log('expected x**y==81',await jevalx('(async()=>x**y)()',{x:3,y:4}));

  //console.log('check .process',await jevalx('this.constructor.constructor("return this")().process'));
  //console.log('check process',await jevalx('this.constructor.constructor("return typeof(process)")()'));

  //console.log('check "this"',await jevalx('[this,2**3]'));
  console.log('ZZZ final check=',typeof(process),typeof(Promise));
  console.log('--------- TEST END -----------');
});

```

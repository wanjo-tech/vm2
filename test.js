//process.on('unhandledRejection', (reason, promise) => { console.error('!!!! test.js unhandledRejection', promise, 'reason:', reason); });

var argv2o=(a,m)=>(a||require('process').argv||[]).reduce((r,e)=>((m=e.match(/^(\/|--?)([\w-]*)="?(.*)"?$/))&&(r[m[2]]=m[3]),r),{});
const console_log = console.log;

(async()=>{
  let argo = argv2o();
  console_log(argo);
  let test_cases = require('./test_cases');
  try{
    let rst = await test_cases[argo.case]()
    console_log('rst',rst);
  }catch(ex){
    console_log('ex=',ex)
  }
})().then(async()=>{
  console_log('-----then')
}).catch(async(ex)=>{
  console_log('-----catch',ex)
});

/**
e.g..
node test /case=q7
*/


/**

quick notes

The difference between `__proto__` and `prototype` is simple: `__proto__` is a property of an object instance, while `prototype` is a property of a constructor function.
When you use `__proto__`, you're looking up properties and methods on an object's prototype chain. On the other hand, `prototype` defines the shared properties and methods that all instances created from a constructor function will have.

__proto__ almost is getPrototypeOf() but sometime not exactly...same... most pollution came from there.

*/

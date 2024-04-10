process.on('unhandledRejection', (reason, promise) => { console.error('!!!! test.js unhandledRejection', promise, 'reason:', reason); });

var argv2o=(a,m)=>(a||require('process').argv||[]).reduce((r,e)=>((m=e.match(/^(\/|--?)([\w-]*)="?(.*)"?$/))&&(r[m[2]]=m[3]),r),{});
const console_log = console.log;

(async()=>{
  let argo = argv2o();
  console_log(argo);
  let test_cases = require('./test_cases');
  try{
    let rst = await test_cases[argo.case]()
    console_log(rst = rst);
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

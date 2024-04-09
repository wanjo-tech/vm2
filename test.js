var argv2o=(a,m)=>(a||require('process').argv||[]).reduce((r,e)=>((m=e.match(/^(\/|--?)([\w-]*)="?(.*)"?$/))&&(r[m[2]]=m[3]),r),{});

(async()=>{
  let argo = argv2o();
  console.log(argo);
  let test_cases = require('./test_cases');
  let rst = await test_cases[argo.case]()
  console.log(rst);
})()

/**
e.g..
node test /case=q7
*/

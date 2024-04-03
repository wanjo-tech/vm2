process.on('unhandledRejection', (reason, promise) => {
  console.error('!!!! WARNING unhandledRejection', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
  console.log('Uncaught exception:', error);
});
(async()=>{
  console.log('see');
  var code=`(async()=>({then:()=>{}}))()`;
  //var code=`(async()=>{await((async()=>({then:()=>{}}))())})()`;//too
  var rst = eval(code)
  console.log({rst});
  try{
    await rst;
  }catch(ex){
    console.log({ex})
  }finally{
    console.log('finally')
  }
  console.log('tomorrow');//failed to here!!! it's a native bug of nodejs
})()

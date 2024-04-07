(async()=>{
  const vm = require('node:vm');
  var {jevalx_raw,jevalx_ext} = require('./jevalx');
  let ctxx,rst;
  let dump=async(v)=>{
    let code = `(()=>{let v=${v};return[typeof v,''+v]})()`;
    try{
      [ctxx,rst] = await jevalx_ext(code,ctxx);
      console.log(code,'=>',rst);
    }catch(ex){
      console.error(code,'=>'+ex)
    }
  };
  await dump('Object.getPrototypeOf');
  await dump('Object.prototype.getPrototypeOf');
  await dump('Object.__proto__.getPrototypeOf');
  await dump('constructor');
  await dump('constructor.__proto__');
  await dump('constructor.__proto__.__getSetter__');
  await dump('[].constructor');
  await dump('[].constructor.__proto__');
  await dump('[].constructor.prototype');
})()


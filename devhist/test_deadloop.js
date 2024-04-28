process.on('unhandledRejection', (reason, tag) => { console.error('???? ========> test.js uncaughtException', reason); });
process.on('uncaughtException', (reason, tag) => { console.error('???? ========> test.js uncaughtException', reason); });

const vm = require('vm');

const sandbox = {
  console: console,
  //setImmediate: setImmediate,
  //queueMicrotask: queueMicrotask,
  //Object: Object,
  //Promise: Promise
};


let jss=JSON.stringify(`
  //h=console.log;
  h=eval;
  f=async()=>{try{
    console.error('aa', new Date()/*,new Error().stack*/);
    //throw new Error();
    throw 999;
  }catch(e){
    console.error('bb', new Date()/*,new Error().stack*/);
    //await {then: h.call.bind(f.call, f, 0)};
    await {then:f};
  }}
  f();
console.log('999');
777
`);

const scriptText0 = `

(async function() {
console.log(111);
let z;
(async()=>{
while(1){
  if (z) {
    console.log('z!!!!',new Date());
queueMicrotask(() => {
    console.log('!!!Microtask executed in VM 111');
throw 111;
  });
    while(1);//block but won't exit...
  }
  else console.log('!z',new Date())
  await 0;
}

})();

queueMicrotask(() => {
    console.log('Microtask executed in VM 222');
  });

z=eval(${jss});

console.log('z',z);
queueMicrotask(() => {
    console.log('Microtask executed in VM 333');
  });
while(1)await 1;


})();
`;
let scriptText = `

const originalCall = Function.prototype.call;
let a=[];

Function.prototype.call = function(...args) {
if(this.name){
console.error('call===>',this,this.name,this.toString());
}else{
console.error('call:::',this.toString())
}
return;//
return originalCall.apply(this, args);
};
Function.prototype.call=undefined;

let z = (async()=>{
(async()=>{
while(1)await {then:1};
})();
try{return await eval(${jss})}
catch(ex){return Promise.reject(ex)}
})();
console.log('z',z)
z
`;

const script = new vm.Script(scriptText);

try {
  //script.runInNewContext(sandbox,{timeout: 666,microtaskMode:undefined/*'afterEvaluate'*/});
  script.runInNewContext(sandbox,{timeout: 666,microtaskMode:'afterEvaluate'});
//console.error('a',a);
  delete script.cachedData;
  delete script;
} catch (e) {
  console.error('Script execution was stopped by vm:', e);
}


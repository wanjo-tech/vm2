const originalCall = Function.prototype.call;

let a=[];
Function.prototype.call = function(...args) {
a.push(this.name);
if(this.name=='then'){
  if (this!=Promise.prototype.then){
    throw 'wtf'
  }
}
//if (this.name && this.name!='log') console.log(this);
return originalCall.apply(this, args);
};

(async()=>{
//return await {then:()=>console.log(999)}
//console.log(888)
//console.log(666)
console.log.call(null,666)
})().then(()=>{
console.log('a',a);
}).catch(ex=>{
console.log('ex',ex,a);
});


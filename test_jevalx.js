process.on('unhandledRejection', (reason, promise) => {
  console.error('WARNING unhandledRejection', promise, 'reason:', reason);
});

var {jevalx} = require('./jevalx.js');

(async()=>{
  console.log('--------- TEST START -----------');
})().then(async()=>{
  let code = `async function f() {}
void (async () => {
        await f();
        await f();
        await f();
        await f();
        this.constructor
.constructor("return process")()
.mainModule.require("fs")
.writeFileSync("pwned_case_a", "");
    })();`;
  try{
    console.log('AAAA result=',await jevalx(code));
  }catch(ex){
    console.log('AAAA ex=',ex);
  }
  console.log('AAAA check=',typeof(process),typeof(Promise));
}).then(async()=>{
  var code=`
    const Symbol= Object.getOwnPropertySymbols(Array)[0].constructor;
    const customInspectSymbol = Symbol.for({
      toString: () => "nodejs.util.inspect.custom",
    });
    throw {
      [customInspectSymbol]: () => {
        this.constructor
          .constructor("return process")()
          .mainModule.require("fs")
          .writeFileSync("pwned_case_b", "");
      },
    }
  `;
  try{
    console.log('BBBB result=',await jevalx(code));
  }catch(ex){
    console.log('BBBB ex=',typeof ex,ex);
  }
  console.log('BBBB check=',typeof(process),typeof(Promise));
}).then(async()=>{
//return;//tmp skip
var code=`
Object.defineProperty(this.constructor.constructor("return this")(),"process",{set(process) { process.mainModule.require("fs").writeFileSync("pwned_case_c", ""+(typeof this)+this)}})
`
  try{
    console.log('CCCC result=',await jevalx(code));
  }catch(ex){
    console.log('CCCC ex=',typeof ex,ex);
  }
  console.log('CCCC check=',typeof(process),typeof(Promise));
}).then(async()=>{
var code=`
throw {toString: eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_d', ''))")};
`
  try{
    console.log('DDDD result=',await jevalx(code));
  }catch(ex){
    console.log('DDDD ex=',typeof ex,ex);
  }
  console.log('DDDD check=',typeof(process),typeof(Promise));

}).then(async()=>{
var code=`
const code = "import('fs').then(m=>m.writeFileSync('pwned_case_e', '')).then(o, r)";
const funcCtor = import('').catch(_=>_).constructor.constructor;
const func = funcCtor.bind(null, 'o', 'r', code);
const obj = {};
obj.__defineGetter__("then", func);
//void(async()=>{await obj})();//wont work too
obj
`
  try{
    console.log('EEEE result=',await jevalx(code));
  }catch(ex){
    console.log('EEEE ex=',typeof ex,ex);
  }
  console.log('EEEE check=',typeof(process),typeof(Promise));

}).then(async()=>{
  var code=`
  ({}).constructor.defineProperty(
    this.constructor.constructor("return this")(),
    "_process_or_any",{ set(process) { process.mainModule.require("fs").writeFileSync("pwned_case_f", ""); },
  }
)
  `;
  try{
    console.log('FFFF result=',await jevalx(code));
  }catch(ex){
    console.log('FFFF ex=',typeof ex,ex);
  }
  console.log('FFFF check=',typeof(process),typeof(Promise));
  
}).then(async()=>{
  //var code=`[].constructor.constructor("return Proxy")()`;//anywhere the Proxy?
  //var code=`let global_ = ({}).constructor.constructor("return this")();global_.Proxy`;
  var code=`
  new Proxy((_) => _, {
  get: new Proxy((_) => _, {
    apply: function (target, thisArg, args) {
      args.constructor
        .constructor("return process")()
        ?.mainModule.require("fs")
        .writeFileSync("pwned_case_g", "");
    },
  }),
});`
  try{
    console.log('GGGG result=',await jevalx(code));
  }catch(ex){
    console.log('GGGG ex=',typeof ex,ex);
  }
  console.log('GGGG check=',typeof(process),typeof(Promise));
}).then(async()=>{
  var code=`
  const hostGlobal = this.constructor.constructor("return this")();
hostGlobal.Promise = function (executor) {
  return new Promise(executor).then(() => {
    hostGlobal.process.mainModule.require("fs").writeFileSync("pwned", "");
  });
}
`
  try{
    console.log('HHHH result=',await jevalx(code));
  }catch(ex){
    console.log('HHHH ex=',typeof ex,ex);
  }
  console.log('HHHH check=',typeof(process),typeof(Promise));
}).then(async()=>{
var code=`
const promise = import('').catch(_=>_);
const oldThen = promise.__proto__.then;
var global = oldThen.constructor('return this')();
promise.__proto__.then = function() {
	if (global.process) {
		global.process.mainModule.require("fs").writeFileSync("pwned_case_i", "");
		promise.__proto__.then = oldThen;
	}
	return oldThen.apply(this, arguments);
};
1
`
  try{
    console.log('IIII result=',await jevalx(code));
  }catch(ex){
    console.log('IIII ex=',typeof ex,ex);
  }
  console.log('IIII check=',typeof(process),typeof(Promise));

}).then(async()=>{
var code=`
eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_j', ''))")
`
  try{
    console.log('JJJJ result=',await jevalx(code));
  }catch(ex){
    console.log('JJJJ ex=',typeof ex,ex);
  }
  console.log('JJJJ check=',typeof(process),typeof(Promise));
}).then(async()=>{
var code=`
Reflect.defineProperty(Function.prototype, 'then', {
	get() {
		this();
	}
});
`
  try{
    console.log('KKKK result=',await jevalx(code));
  }catch(ex){
    console.log('KKKK ex=',typeof ex,ex);
  }
  console.log('KKKK check=',typeof(process),typeof(Promise));
}).then(async()=>{
var code=`
Function.bind(null, "import('fs').then(m=>m.writeFileSync('pwned', ''))")
`
  try{
    console.log('LLLL result=',await jevalx(code));
  }catch(ex){
    console.log('LLLL ex=',typeof ex,ex);
  }
  console.log('LLLL check=',typeof(process),typeof(Promise));
}).then(async()=>{
var code=`
const Function = (_=>_).constructor;
Object.defineProperty(Function.prototype, 'then', { get() { this(); } });
Function.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_m', ''))")
`
  try{
    console.log('MMMM result=',await jevalx(code));
  }catch(ex){
    console.log('MMMM ex=',typeof ex,ex);
  }
  console.log('MMMM check=',typeof(process),typeof(Promise));

}).then(async()=>{
var code=`
this.__proto__.__defineGetter__('',function(){ this.process?.mainModule.require("fs").writeFileSync("pwned_case_n","") })
`
  try{
    console.log('NNNN result=',await jevalx(code));
  }catch(ex){
    console.log('NNNN ex=',typeof ex,ex);
  }
  console.log('NNNN check=',typeof(process),typeof(Promise));
}).then(async()=>{
var code=`
const Function = (_=>_).constructor;
const obj = {
	get then() {
		Object.defineProperty(this, 'then', {
			get: Function.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_N', ''))")
		});
		Object.setPrototypeOf(this, import('').catch(_=>_).constructor);
	}
};
obj
`
  try{
    console.log('OOOO result=',await jevalx(code));
  }catch(ex){
    console.log('OOOO ex=',typeof ex,ex);
  }
  console.log('OOOO check=',typeof(process),typeof(Promise));

}).then(async()=>{
var code=`
this.constructor.prototype.__defineGetter__('',function(){ this.process?.mainModule.require("fs").writeFileSync("pwned_case_O","") })
`;

  try{
    console.log('PPPP result=',await jevalx(code));
  }catch(ex){
    console.log('PPPP ex=',typeof ex,ex);
  }
  console.log('PPPP check=',typeof(process),typeof(Promise));

}).then(async()=>{
var code=`
Object.getPrototypeOf(Object.getPrototypeOf(import('').catch(_=>_))).__defineGetter__('',function(){ this.process?.mainModule.require("fs").writeFileSync("pwned_case_q1","") })
`;

  try{
    console.log('Q1 result=',await jevalx(code));
  }catch(ex){
    console.log('Q1 ex=',typeof ex,ex);
  }
  console.log('Q1 check=',typeof(process),typeof(Promise));

}).then(async()=>{
var code=`
const Function = (_=>_).constructor;
const proto = {};
Object.defineProperty(proto, 'then', {
	get: Function.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_q2', ''))")
});
const obj = {
	__proto__: proto
};
obj
`;

  try{
    console.log('Q2 result=',await jevalx(code));
  }catch(ex){
    console.log('Q2 ex=',typeof ex,ex);
  }
  console.log('Q2 check=',typeof(process),typeof(Promise));

}).then(async()=>{
  //basic normal case:
  console.log('expected x**y==8',await jevalx('x**y',{x:2,y:3}));
  console.log('expected x**y==81',await jevalx('(async()=>x**y)()',{x:3,y:4}));

  //console.log('check .process',await jevalx('this.constructor.constructor("return this")().process'));
  console.log('check process',await jevalx('[].constructor.constructor("return typeof(process)")()'));

  //console.log('check "this"',await jevalx('[this,2**3]'));
  console.log('ZZZ final check=',typeof(process),typeof(Promise));
  console.log(Promise);
  console.log(Promise.prototype);
  console.log(Proxy);
  console.log(Error);
  console.log('--------- TEST END -----------');
});


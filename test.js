//process.on('unhandledRejection', (reason, promise) => { console.error('!!!! test.js unhandledRejection', promise, 'reason:', reason); });

var argv2o=(a,m)=>(a||require('process').argv||[]).reduce((r,e)=>((m=e.match(/^(\/|--?)([\w-]*)="?(.*)"?$/))&&(r[m[2]]=m[3]),r),{});
const console_log = console.log;
//let assertWtf = require('assert');

let jevalxModule = require('./jevalx.js');
let jevalx = jevalxModule.jevalx;

const fs = require('fs').promises;
const path = require('path');

async function searchFiles(directory, pattern) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    const foundFiles = files.filter(file => file.isFile() && pattern.test(file.name));

    if (foundFiles.length > 0) {
      throw new Error(`Found files matching pattern "${pattern}": ${foundFiles.map(f => f.name).join(', ')}`);
    } else {
      console.log('No files found matching the pattern.'+pattern);
    }
  } catch (error) {
    console.error('Error searching files:', error);
    throw error; // Rethrow the error if necessary
  }
}


module.exports = {

AAAA:async function(){ let case_id = arguments.callee.name;
  let code = `
async function f() {}
void (async () => {
        await f();
        await f();
        await f();
        await f();
        this.constructor
.constructor("return process")()
.mainModule.require("fs")
.writeFileSync("pwned_case_a", "");
})();
`;
  try{
    var rst = await jevalx(code);
    console.log(`${case_id} result=`,rst);
  }catch(ex){ console.log(`${case_id}.ex=`,ex); } console.log(`${case_id}.check=`,typeof(process),typeof(Promise));
},
q7:async()=>{
     var code=`(async()=>{
         let u = false;
         function t(o, e) {
         import('').then(_=>{ return _; }, _=>{ return _}).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q7","");
         u = true;
         o(this);
         }
         const obj = {__proto__: { get then(){
         if (u) { u = false; return undefined; } return t; } }};
         return obj
         })
     `
       try{
         console_log('Q7 result=',await jevalx(code,{console_log}));
       }catch(ex){
         console_log('Q7 ex=',ex);
       }
     console_log('Q7 check=',typeof(process),typeof(Promise));
   },
BBBB:async()=>{
////https://gist.github.com/leesh3288/e4aa7b90417b0b0ac7bcd5b09ac7d3bd
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
    console.log('BBBB ex=',ex.message);
  }
  console.log('BBBB check=',typeof(process),typeof(Promise));
},
BBB2:async()=>{
var case_id='BBB2';
  var code=`
    const customInspectSymbol = Symbol.for({
      toString: () => "nodejs.util.inspect.custom",
    });
    throw {
      [customInspectSymbol]: () => {
        this.constructor
          .constructor("return process")()
          .mainModule.require("fs")
          .writeFileSync("pwned_case_b2", "");
      },
    }
  `;
  try{
    console_log('BBB2 result=',await jevalx(code));
  }catch(ex){
    console_log('BBB2 ex=',ex.message);
  }
  console_log('BBB2 check=',typeof(process),typeof(Promise));
},

CCCC:async()=>{
var code=`
Object.defineProperty(this.constructor.constructor("return this")(),"process",{set(process) { process.mainModule.require("fs").writeFileSync("pwned_case_c", ""+(typeof this)+this)}})
`
  try{
    console.log('CCCC result=',await jevalx(code));
  }catch(ex){
    console.log('CCCC ex=',ex.message);
  }
  console.log('CCCC check=',typeof(process),typeof(Promise));
},

DDDD:async()=>{
var code=`
throw {toString: eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_d', ''))")};
`
  try{
    console.log('DDDD result=',await jevalx(code));
  }catch(ex){
    console.log('DDDD ex=',ex.message);
  }
  console.log('DDDD check=',typeof(process),typeof(Promise));

},

EEEE:async()=>{
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
    console.log('EEEE ex=',ex.message);
  }
  console.log('EEEE check=',typeof(process),typeof(Promise));

},
FFFF:async function(){
let case_id = arguments.callee.name;
  var code=`
  ({}).constructor.defineProperty(
    this.constructor.constructor("return this")(),
    "_process_or_any",{ set(process) { process.mainModule.require("fs").writeFileSync("pwned_case_f", ""); },
  }
)
`;
  try{
    var rst = await jevalx(code);
    console.log(`${case_id} result=`,rst);
  }catch(ex){ console.log(`${case_id}.ex=`,ex); } console.log(`${case_id}.check=`,typeof(process),typeof(Promise));

},
GGGG:async()=>{
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
})`
  try{
    console.log('GGGG result=',await jevalx(code));
  }catch(ex){
    console.log('GGGG ex=',ex.message);
  }
  console.log('GGGG check=',typeof(process),typeof(Promise));
},

HHHH:async()=>{
  var code=`
  const hostGlobal = this.constructor.constructor("return this")();
hostGlobal.Promise = function (executor) {
  return new Promise(executor).then(() => {
    hostGlobal.process.mainModule.require("fs").writeFileSync("pwned_case_h", "");
  });
}
`
  try{
    console.log('HHHH result=',await jevalx(code));
  }catch(ex){
    console.log('HHHH ex=',ex.message);
  }
  console.log('HHHH check=',typeof(process),typeof(Promise));
},

IIII:async()=>{
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
    console.log('IIII ex=',ex.message);
  }
  console.log('IIII check=',typeof(process),typeof(Promise));

},
X2:async()=>{
var code=`
const promise = import('').catch(_=>_);
const oldThen = promise.__proto__.then;
const global = oldThen.constructor('return this')();
promise.__proto__.then = function() {
	if (global.process) {
		global.process.mainModule.require("fs").writeFileSync("pwned_i2", "");
		promise.__proto__.then = oldThen;
	}
	return oldThen.apply(this, arguments);
};
false
`
  try{
    console.log('I2 result=',await jevalx(code));
  }catch(ex){
    console.log('I2 ex=',ex.message);
  }
  console.log('I2 check=',typeof(process),typeof(Promise));

},
JJJJ:async()=>{
var code=` eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_j', ''))") `
  try{
    console.log('JJJJ result=',await jevalx(code));
  }catch(ex){
    console.log('JJJJ ex=',ex.message);
  }
  console.log('JJJJ check=',typeof(process),typeof(Promise));
},
J2:async()=>{
var code=`(_=>_).constructor.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_j2', ''))")`;
  try{
    console.log('J2 result=',await jevalx(code));
  }catch(ex){
    console.log('J2 ex=',ex.message);
  }
  console.log('J2 check=',typeof(process),typeof(Promise));

},
KKKK:async()=>{
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
    console.log('KKKK ex=',ex.message);
  }
  console.log('KKKK check=',typeof(process),typeof(Promise));
},

K2:async()=>{
var code=`
Reflect.defineProperty(constructor.prototype, 'cachedData', {get(){this.importModuleDynamically.constructor('return process')().then(p=>p.mainModule.require("fs").writeFileSync("pwned_k2", ""))}})
`
  try{
    console.log('K2 result=',await jevalx(code));
  }catch(ex){
    console.log('K2 ex=',ex.message);
  }
  console.log('K2 check=',typeof(process),typeof(Promise));
},

LLLL:async()=>{
var code=`
Function.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_L', ''))")
`
  try{
    console.log('LLLL result=',await jevalx(code));
  }catch(ex){
    console.log('LLLL ex=',ex.message);
  }
  console.log('LLLL check=',typeof(process),typeof(Promise));
},

L2:async()=>{
var code=`
(async()=>0).bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_L2', ''))")
`
  try{
    console.log('L2.result=',await jevalx(code));
  }catch(ex){
    console.log('L2.ex=',ex.message);
  }
  console.log('L2.check=',typeof(process),typeof(Promise));
},

MMMM:async()=>{
var code=`
const FunctionX = (_=>_).constructor;
Object.defineProperty(Function.prototype, 'then', { get() { this(); } });
FunctionX.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_m', ''))")
`
  try{
    console.log('MMMM result=',await jevalx(code));
  }catch(ex){
    console.log('MMMM ex=',ex.message);
  }
  console.log('MMMM check=',typeof(process),typeof(Promise));

},

NNNN:async()=>{
var code=`
this.__proto__.__defineGetter__('',function(){ this.process?.mainModule.require("fs").writeFileSync("pwned_case_n","") })
`
  try{
    console.log('NNNN result=',await jevalx(code));
  }catch(ex){
    console.log('NNNN ex=',ex.message);
  }
  console.log('NNNN check=',typeof(process),typeof(Promise));
},

OOOO:async()=>{
var code=`
const FunctionX = (_=>_).constructor;
const obj = {
	get then() {
		Object.defineProperty(this, 'then', {
			get: FunctionX.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_N', ''))")
		});
		Object.setPrototypeOf(this, import('').catch(_=>_).constructor);
	}
};
obj
`
  try{
    console.log('OOOO result=',await jevalx(code));
  }catch(ex){
    console.log('OOOO ex=',ex.message);
  }
  console.log('OOOO check=',typeof(process),typeof(Promise));

},

PPPP:async()=>{
var code=`
this.constructor.prototype.__defineGetter__('',function(){ this.process?.mainModule.require("fs").writeFileSync("pwned_case_O","") })
`;

  try{
    console.log('PPPP result=',await jevalx(code));
  }catch(ex){
    console.log('PPPP ex=',ex.message);
  }
  console.log('PPPP check=',typeof(process),typeof(Promise));

},

Q1:async()=>{
var code=`
Object.getPrototypeOf(Object.getPrototypeOf(import('').catch(_=>_))).__defineGetter__('',function(){ this.process?.mainModule.require("fs").writeFileSync("pwned_case_q1","") })
`;

  try{
    console.log('Q1 result=',await jevalx(code));
  }catch(ex){
    console.log('Q1 ex=',ex.message);
  }
  console.log('Q1 check=',typeof(process),typeof(Promise));

},

Q2:async()=>{
var code=`
const FunctionX = (_=>_).constructor;
const proto = {};
Object.defineProperty(proto, 'then', {
	get: FunctionX.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_q2', ''))")
});
const obj = {
	__proto__: proto
};
obj
`;

  try{
    console.log('Q2 result=',await jevalx(code));
  }catch(ex){
    console.log('Q2 ex=',ex.message);
  }
  console.log('Q2 check=',typeof(process),typeof(Promise));

},

Q3:async()=>{
var code=`
const FunctionX = (_=>_).constructor;
const proto = {};
proto.__defineGetter__('then', FunctionX.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_q3', ''))"));
const obj = {
	__proto__: proto
};
obj
`
  try{
    console.log('Q3 result=',await jevalx(code));
  }catch(ex){
    console.log('Q3 ex=',ex.message);
  }
  console.log('Q3 check=',typeof(process),typeof(Promise));

},

Q4:async()=>{
var code=`
const FunctionX = (_=>_).constructor;
const proto = {};
Object.defineProperties(proto, {then: {get: FunctionX.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_q4', ''))")}});
const obj = {
	__proto__: proto
};
obj
`
  try{
    console.log('Q4 result=',await jevalx(code));
  }catch(ex){
    console.log('Q4 ex=',ex.message);
  }
  console.log('Q4 check=',typeof(process),typeof(Promise));

},

Q5:async()=>{
var code=`
let u = false;
function t(o, e) {
	import('').then(_=>_, _=>_).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q5","");
	u = true;
	o(this);
}
const obj = {__proto__: {
	get then(){
		if (u) {
			u = false;
			return undefined;
		}
		return t;
	}
}};
obj
`;
  try{
    console.log('Q5 result=',await jevalx(code));
  }catch(ex){
    console.log('Q5 ex=',ex.message);
  }
  console.log('Q5 check=',typeof(process),typeof(Promise));

},

Q6:async()=>{
var code=`
(()=>{
let u = false;
function t(o, e) {
	import('').then(_=>_, _=>_).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q6","");
	u = true;
	o(this);
}
const obj = {__proto__: { get then(){ if (u) { u = false; return undefined; } return t; } }};
return obj
})
`

  try{
    console.log('Q6 result=',await jevalx(code));
  }catch(ex){
    console.log('Q6 ex=',ex.message);
  }
  console.log('Q6 check=',typeof(process),typeof(Promise));

},

Q7:async()=>{
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

Q7x:async()=>{
  //await jevalx(`(async()=>{ return ({ then:()=>{} }) })() `)
  //var code=`(async()=>{ return ({ then:()=>{} }) })() `
  var code=`(async()=>({ then:()=>{} }))() `
  //var code=`(async()=>999)()`
  try{
    console.log('Q7x result=',await jevalx(code));
  }catch(ex){
    console.log('Q7x ex=',ex);
  }
  console.log('Q7x check=',typeof(process),typeof(Promise));

},
Q8:(async()=>{
var code=`
let u = false;
function t(o, e) {
	import('').then(_=>_, _=>_).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q8","");
	u = true;
	o(this);
}
delete Object.prototype.__proto__;
(async()=>{
const obj = { __proto__: { get then(){ if (u) { u = false; return undefined; } return t; } }};
return obj
})
`
  try{
    console.log('Q8 result=',await jevalx(code));
  }catch(ex){
    console.log('Q8 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q8 check=',typeof(process),typeof(Promise));
}),
Q9:(async()=>{
var code=`
let delay = 3;
function t(o, e) {
	//import('').then(_=>_, _=>_).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q9","");
import('').then(_=>_,_=>_).then.constructor("return 999")();
	o(this);
}
const obj = {__proto__: { __proto__: { __proto__: {
	get then(){
		if (delay-->0) return undefined;
		return t;
	}
}}}};
obj
`
  try{
    console.log('Q9 result=',await jevalx(code));
  }catch(ex){
    console.log('Q9 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q9 check=',typeof(process),typeof(Promise));

}),
Q10:(async()=>{
var code=`
let delay = 2;
function t(o, e) {
	import('').then(_=>_, _=>_).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q10","");
	o(this);
}
let obj = {__proto__: {
	get then(){
		if (delay-->0) return undefined;
		return t;
	}
}};
for(let i=0; i<9; i++) {const ret=obj;obj=()=>ret;}
obj
`
  try{
    console.log('Q10 result=',await jevalx(code));
  }catch(ex){
    console.log('Q10 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q10 check=',typeof(process),typeof(Promise));

}),
Q11:(async()=>{
var code=`
const O = constructor;

O.defineProperty(O.prototype, 'XXX', {get(){

	this.process.mainModule.require("fs").writeFileSync("pwned_case_q11", "");

}, enumerable: true});

false
`
  try{
    console.log('Q11 result=',await jevalx(code));
  }catch(ex){
    console.log('Q11 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q11 check=',typeof(process),typeof(Promise));


}),

Q12:(async()=>{
var code=`

const promise = import('').catch(_=>_);

const oldThen = promise.__proto__.then;

const global = oldThen.constructor('return this')();

promise.__proto__.then = function() {

	if (global.process) {

		global.process.mainModule.require("fs").writeFileSync("pwned_case_q12", "");

	}

	return oldThen.apply(this, arguments);

};

Object.freeze(promise.__proto__);

false

`
  try{
    console.log('Q12 result=',await jevalx(code));
  }catch(ex){
    console.log('Q12 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q12 check=',typeof(process),typeof(Promise));


}),
Q13:(async()=>{
var code=`
this.constructor.__defineSetter__('freeze', f=>f.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_q13", ""));
false
`
  try{
    console.log('Q13 result=',await jevalx(code));
  }catch(ex){
    console.log('Q13 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q13 check=',typeof(process),typeof(Promise));

}),
Q14:(async()=>{
var code=`
const global = constructor.constructor('return this')()
global.Object = Object.assign({set freeze(f){f.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_q14", "")}}, global.Object);
false
`
  try{
    console.log('Q14 result=',await jevalx(code));
  }catch(ex){
    console.log('Q14 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q14 check=',typeof(process),typeof(Promise));

}),
Q15:(async()=>{
var code=`
({then: 1, toString: eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_q15', ''))")})
`
  try{
    var rst = await jevalx(code);
    console.log('Q15 result=',rst);
    //console.log('Q15 result=',await rst.toString());//will trigger evil?
  }catch(ex){
    console.log('Q15 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q15 check=',typeof(process),typeof(Promise));

}),
Q16:(async()=>{

// { toString: [Function: bound evil] }
var code=`
({then:(r,j)=>r({toString:eval.bind(null,"import('fs').then(m=>m.writeFileSync('pwned_q16', ''))")})})
`
  try{
    console.log('Q16 result=',await jevalx(code));//trigger pwn !!!
    //console.log('Q16 result=',String(await jevalx(code)));//trigger pwn !!!
    //console.log('Q16 result=',await jevalx(code));
  }catch(ex){
    console.log('Q16 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q16 check=',typeof(process),typeof(Promise));
}),
Q17:(async()=>{
var code=`
//const Function = (_=>_).constructor;
({then:(r,j)=>r({toString:Function.bind(null,"import('fs').then(m=>m.writeFileSync('pwned_q17', ''))")})})
`
  try{
    //console.log('Q17 result=',await jevalx(code));
    console.log('Q17 result=',String(await jevalx(code)));
  }catch(ex){
    console.log('Q17 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q17 check=',typeof(process),typeof(Promise));

}),
Q18:(async()=>{
var code=`
const global = constructor.constructor('return this')()
global.Object = {set freeze(f){f.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_q18", "")}};
false
`
  try{
    console.log('Q18 result=',String(await jevalx(code)));
  }catch(ex){
    console.log('Q18 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q18 check=',typeof(process),typeof(Promise));

}),
Q19:(async()=>{
var code=`
({hasOwnProperty: eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_q19', ''))")})
`
  try{
    console.log('Q19 result=',await jevalx(code));
  }catch(ex){
    console.log('Q19 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q19 check=',typeof(process),typeof(Promise));

}),
Q20:(async()=>{
var code=`
const global = constructor.constructor('return this')()
global.Array = {set freeze(f){f.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_q20", "")}};
[1,2,3,]
`
  try{
    console.log('Q20 result=',await jevalx(code));
  }catch(ex){
    console.log('Q20 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q20 check=',typeof(process),typeof(Promise));

}),
Q21:(async()=>{
var code=`
hasOwnProperty.bind = eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_q21', ''))");
true
`;
  try{
    console.log('Q21 result=',await jevalx(code));
  }catch(ex){
    console.log('Q21 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q21 check=',typeof(process),typeof(Promise));

}),
Q22:(async()=>{
//({}).constructor.keys(0).__proto__.push = eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_q22', ''))");
var code=`
constructor.keys(0).__proto__.push = eval.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_q22', ''))");
({toString:1})
`;
  try{
    console.log('Q22 result=',await jevalx(code));
  }catch(ex){
    console.log('Q22 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q22 check=',typeof(process),typeof(Promise));
}),

Q23:(async()=>{
var code=`
constructor.prototype.__defineGetter__('cachedData', function(){this.importModuleDynamically.constructor('return process')().then(p=>p.mainModule.require("fs").writeFileSync("pwned_q22", ""))});
(_=>_)
`;
  try{
    console.log('Q23 result=',await jevalx(code));
  }catch(ex){
    console.log('Q23 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q23 check=',typeof(process),typeof(Promise));
}),
Q24:(async()=>{
var code=`
Object.defineProperty(constructor.prototype, 'cachedData', {get(){this.importModuleDynamically.constructor('return process')().then(p=>p.mainModule.require("fs").writeFileSync("pwned_q24", ""))}});
(_=>_)
`;
  try{
    console.log('Q24 result=',await jevalx(code));
  }catch(ex){
    console.log('Q24 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q24 check=',typeof(process),typeof(Promise));
}),
Q25:(async()=>{
var code=`
constructor.defineProperty(constructor.prototype, 'cachedData', {get(){this.importModuleDynamically.constructor('return process')().then(p=>p.mainModule.require("fs").writeFileSync("pwned_q25", ""))}});
(_=>_)
`;
  try{
    console.log('Q25 result=',await jevalx(code));
  }catch(ex){
    console.log('Q25 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q25 check=',typeof(process),typeof(Promise));
}),
Q26:(async()=>{
var code=`
async function f(){
	throw {toString: [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q26', ''))"]))};
}
f()
f()
`
  try{
    console.log('Q26 result=',await jevalx(code));
  }catch(ex){
    console.log('Q26 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q26 check=',typeof(process),typeof(Promise));

}),
Q27:(async()=>{
var code=`
const Function = (_=>_).constructor;
async function f(){
	throw {toString: [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q26', ''))"]))};
}
f()
f()
`
  try{
    console.log('Q27 result=',await jevalx(code));
  }catch(ex){
    console.log('Q27 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q27 check=',typeof(process),typeof(Promise));


}),
Q28:(async()=>{
var code=`
const Function = (_=>_).constructor;
const a = constructor.prototype.__proto__.constructor.keys(0);
const s = Object.getOwnPropertySymbols(a.__proto__)[0];
const i = a[s]().__proto__;
const n = i.next;
i.next = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q28', '')); return n.call(a[s]());"]));
`;
  try{
    console.log('Q28 result=',await jevalx(code));
  }catch(ex){
    console.log('Q28 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q28 check=',typeof(process),typeof(Promise));

}),
Q29:(async()=>{
var code=`
const Function = (_=>_).constructor;
const Object = {}.constructor;
const a = constructor.prototype.__proto__.constructor.keys(0);
const s = Object.getOwnPropertySymbols(a.__proto__)[0];
const i = a[s]().__proto__;
const n = i.next;
i.next = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q29', '')); return n.call(a[s]());"]));
`;
  try{
    console.log('Q29 result=',await jevalx(code));
  }catch(ex){
    console.log('Q29 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q29 check=',typeof(process),typeof(Promise));

}),
Q30:(async()=>{
var code=`
const Function = (async _=>_).constructor;
const Object = import('').catch(_=>_).__proto__.__proto__.constructor;
const a = constructor.prototype.__proto__.constructor.keys(0);
const s = Object.getOwnPropertySymbols(a.__proto__)[0];
const i = a[s]().__proto__;
const n = i.next;
i.next = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q30', '')); return n.call(a[s]());"]));
`
  try{
    console.log('Q30 result=',await jevalx(code));
  }catch(ex){
    console.log('Q30 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q30 check=',typeof(process),typeof(Promise));

}),

q31:async()=>{
 var code=`
  const Function = (async _=>_).constructor;
const Object = import('').catch(_=>_).__proto__.__proto__.constructor;
Object.__proto__ = {
	set defineProperty(f) {
		f(this, 'assign', {set: [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q31', ''))"]))});
	}
};
false
`
  try{
    console_log('Q31 result=',await jevalx(code,{console_log}));
  }catch(ex){
    console_log('Q31 ex=',ex.message,JSON.stringify(ex.js));
  }
  console_log('Q31 check=',typeof(process),typeof(Promise));

},
q32:async()=>{
var code=`
const Function = (async _=>_).constructor;
constructor.__proto__.apply = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q32', ''))"]));
import('').catch();
1
`
  try{
    console.log('Q32 result=',await jevalx(code,{console_log}));
  }catch(ex){
    console.log('Q32 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q32 check=',typeof(process),typeof(Promise));

},

Q33:(async()=>{
var code=`
const Function = (async _=>_).constructor;
const Object = constructor.prototype.__proto__.constructor;
console_log(999,''+Object.defineProperty);
Object.defineProperty(Object.__proto__, 'catch', {
	set: [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q33', ''))"])),
	get: ()=>1
});
false
`
  try{
    console.log('Q33 result=',await jevalx(code));
  }catch(ex){
    console.log('Q33 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q33 check=',typeof(process),typeof(Promise));

}),
Q34:(async()=>{
var code=`
const Function = (async _=>_).constructor;
const Object = constructor.__proto__.__proto__.constructor;
Object.defineProperty(Object.__proto__, 'catch', {
	set: [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q34', ''))"])),
	get: ()=>1
});
false
`
  try{
    console.log('Q34 result=',await jevalx(code));
  }catch(ex){
    console.log('Q34 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q34 check=',typeof(process),typeof(Promise));

}),

R1:(async()=>{
//https://gist.github.com/leesh3288/f693061e6523c97274ad5298eb2c74e9
var code=`
//Symbol= Object.getOwnPropertySymbols(Array)[0].constructor;
async function fn() {
    (function stack() {
        new Error().stack;
        stack();
    })();
}
p = fn();
p.constructor = {
    [Symbol.species]: class FakePromise {
        constructor(executor) {
            executor(
                (x) => x,
                (err) => { return err.constructor.constructor('return process')().mainModule.require('child_process').execSync('touch pwned_r1'); }
            )
        }
    }
};
p.then();
`;
  try{
    console.log('R1 result=',await jevalx(code));
  }catch(ex){
    console.log('R1 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('R1 check=',typeof(process),typeof(Promise));

}),

  r4:async()=>{
var case_id= 'r4';
var code=`
import('').catch(_=>_).constructor.__proto__ = {
        set constructor(f) { f("return process")().mainModule.require("fs").writeFileSync("pwned_${case_id}", "");}
}
`;
       try{
         console_log(`${case_id} result=`,await jevalx(code,{console_log}));
       }catch(ex){
         console_log(`${case_id} ex=`,ex);
       }
     console_log(`${case_id} check=`,typeof(process),typeof(Promise));
  },

  r5:async()=>{
var case_id= 'r5';
var code=`
const i = import('');
try { i.then() } catch (e) {}
i.constructor.constructor("return process")().mainModule.require("fs").writeFileSync("pwned_${case_id}", "")
`;
       try{
         console_log(`${case_id} result=`,await jevalx(code,{console_log}));
       }catch(ex){
         console_log(`${case_id} ex=`,ex);
       }
     console_log(`${case_id} check=`,typeof(process),typeof(Promise));
  },

  r6:async()=>{
let case_id = arguments.callee.name;
var code=`
const Function = (_=>_).constructor;
constructor.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_${case_id}', ''))"]));
import('fs').catch();
`;
       try{
         console_log(`${case_id} result=`,await jevalx(code,{console_log}));
       }catch(ex){
         console_log(`${case_id} ex=`,ex);
       }
     console_log(`${case_id} check=`,typeof(process),typeof(Promise));
  },


LAST:(async()=>{ //normal case:

  console.log('ASSERT 8 == x**y',await jevalx('x**y',{x:2,y:3}));
  //assertWtf.equal( 8 , await jevalx('x**y',{x:2,y:3}) );
  console.log('ASSERT 81 == x**y',await jevalx('(async()=>x**y)()',{x:3,y:4}));
  //assertWtf.equal( 81 , await jevalx('x**y',{x:3,y:4}) );
  console.log('ASSERT 8, ()=>x**y',await jevalx('()=>x**y',{x:2,y:3}));

  console.log('ASSERT 27 == new Promise(r=>r(x**y))',await jevalx('new Promise(r=>r(x**y))',{x:3,y:3}));

  //console.log('ASSERT undefined == process:',await jevalx('[].constructor.constructor("return typeof(process)")()'));

  //console.log('check "this"',await jevalx('[this,2**3]'));
  console.log("ASSERT object,function', typeof(process),typeof(Promise) =",typeof(process),typeof(Promise));
  console.log('Promise',Promise);
  console.log('Proxy',Proxy);
  console.log('Error',Error);
  console.log('require',typeof require);
  console.log('Array.prototype.push',Array.prototype.push);

  //console.log('tmp',await jevalx(` const hostGlobal = this.constructor.constructor("return this")(); hostGlobal.__proto__.__defineGetter__ `));
  //console.log('tmp',await jevalx(`void(async()=>{throw 911})()`));
  // quick testing return a function that hacks:

  // core doesn't pass the ddos-alike codes:
  try{ console.log('deadloop',await jevalx(`(async()=>{while(1)0})`)) }catch(ex){ console.log('deadloop.ex',ex); }
}),

}

if (require.main === module) {
  let argo = argv2o();
  console_log(argo);
  (async()=>{
    let test_cases = require('./test');
    //console_log('test_cases',test_cases);
    let case_id = argo.case;
    if (case_id) {
      await test_cases[case_id]();
console_log('-------------- test pwn* ---------------');
await searchFiles('.',/pwn*/);
    }else{
      console_log('-------------- test all start ---------------');
      for (let k in test_cases){
        console_log(`-------------- test ${k} start---------------`);
//
        await test_cases[k]();
        console_log(`-------------- test ${k} end ---------------`);
      }
      console_log('-------------- test pwn* ---------------');
await searchFiles('.',/pwn*/);
      console_log('-------------- test ALL end ---------------');
    }
  })().catch(ex=>{
    console_log('main.catch.ex',ex);
  });
}
/**
e.g..
node test /case=q7
or for all
node test 

*/


/**

quick notes

The difference between `__proto__` and `prototype` is simple: `__proto__` is a property of an object instance, while `prototype` is a property of a constructor function.
When you use `__proto__`, you're looking up properties and methods on an object's prototype chain. On the other hand, `prototype` defines the shared properties and methods that all instances created from a constructor function will have.

__proto__ almost is getPrototypeOf() but sometime not exactly...same... most pollution came from there.

*/

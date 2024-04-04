# Replacement for discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

I post the hide-and-seek solution here for your referece here.  Wish you a good day. 

Challenge still accepted!

The plan is simple, hide before call and recover when done.  Might be dirty but it is useful when sandbox still needed for projects.

## code

https://github.com/wanjo-tech/vm2/blob/main/jevalx.js

## test cases

good to expected "process is not defined".  passed most vulnerable cases, while I'm stilling looking for new ones, please let me know if any.

https://github.com/wanjo-tech/vm2/blob/main/test_jevalx.js

## key notes

* (DONE) process(and few others) must be hidden before calling, and then restore after all set.
* (DONE) using setTimeout to wait for the vm done.
* (DONE) \_\_defineGetter\_\_ must be banned.
* (DONE) import() must be banned. 
* (DONE) Evil Fake Promise should be detected.
* (DONE) hacks (\_\_proto\_\_ -chain, ) must be defended.

thanks to @j4k0xb and @XmiliaH keep sending wonderful cases even being annoyed by me ;)

## application

I use it in my kk project.



# Replacement for discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

I post the hide-and-seek solution here for your referece here.  Wish you a good day. Challenge still accepted.

The plan is simple, hide before call and recover when done.  Might be dirty but it is useful when sandbox still needed for projects.

## code

https://github.com/wanjo-tech/vm2/blob/main/jevalx.js

## test cases

good to expected "process is not defined".  passed most vulnerable cases, while I'm stilling looking for new ones, please let me know if any.

https://github.com/wanjo-tech/vm2/blob/main/test_jevalx.js

## key nodes

* (DONE) process must be hidden before calling, and then restore after all set.
* (DONE) import() must be banned. 
* (DONE) Promise..then is vulnerable by being injected, must reset afterward.

thanks @j4k0xb and @XmiliaH keep sending test case even annoyed ;)

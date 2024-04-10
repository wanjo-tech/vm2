# Replacement for discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

We post the solution here for your referece.  Challenge still accepted!

## code

https://github.com/wanjo-tech/vm2/blob/main/jevalx.js

## test cases

https://github.com/wanjo-tech/vm2/blob/main/test_jevalx.js

## key notes
* constructor[at]sandbox == Object[at]host != Object[at]sandbox
* (DONE) eval() is routed to sandbox it self
* (DONE) route \_\_proto\_\_.constructor inside the sandbox to the inner eval()
* (DONE) apply setTimeout() to delay waiting for the sandbox done.
* (DONE) Promise/function now auto re-entried (in max 9 level)
* (DONE) import() can be intercepted. (TODO) handover to caller in future
* (DONE) timeout handling to defence ddos attach by codes like: (async()=>{while(1)0})
* (DONT) sth throw from sandbox need to be checked.
* (WAIT) works in bun (another js runtime): not yet, waiting for their patches.

Great thanks to @j4k0xb and @XmiliaH keep sending wonderful cases even being annoyed by me ;)

## application

* I use it in my kk project.
* wait for you

## docker/podman

Even the codes are proven-of-concepts and running fine, we still recommend building the production and public-accessible application run inside docker with removing danger modules such as process and fs in global scope.

## contribution

@j4k0xb, @XmiliaH, and Wanjo (@mgttt)

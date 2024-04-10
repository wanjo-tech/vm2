# Replacement for discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

We post the solution here for your referece.  Challenge still accepted!

## About

Not a full vm, but a sandbox run js in ctx， running so far so good.

## Code

https://github.com/wanjo-tech/vm2/blob/main/jevalx.js

## Quick Test Cases

https://github.com/wanjo-tech/vm2/blob/main/test_jevalx.js

## Key Notes
* (DONE) eval() is routed to sandbox it self
* (DONE) route \_\_proto\_\_.constructor inside the sandbox to the inner eval()
* (DONE) apply setTimeout() to delay waiting for the sandbox done.
* (DONE) Promise/function now auto re-entried (in max 9 level)
* (DONE) import() can be intercepted. (TODO) handover to caller in future
* (DONE) timeout handling to defence ddos attach by codes like: (async()=>{while(1)0})
* (DONT) sth throw from sandbox need to be checked.
* (WAIT) works in bun (another js runtime): not yet, waiting for their patches.

Great thanks to @j4k0xb and @XmiliaH keep sending wonderful cases even being annoyed by me ;)

## Article

* https://github.com/wanjo-tech/vm2/blob/main/en.md

## Application

* I use it in my kk project.
* wait for you

## Docker/Podman/Container

Even the codes are proven-of-concepts and running fine, we still recommend building the production and public-accessible application run inside docker with removing danger modules such as process and fs in global scope.

## Contribution

@j4k0xb, @XmiliaH, and Wanjo (@mgttt)

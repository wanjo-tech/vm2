# Replacement for discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

We post the solution here for your referece here.  Wish you a good day. 

Challenge still accepted!

The plan is simple, just to freeze the danger part!  Might be dirty but it is useful when sandbox still needed for projects.

## code

https://github.com/wanjo-tech/vm2/blob/main/jevalx.js

## test cases

https://github.com/wanjo-tech/vm2/blob/main/test_jevalx.js

## key notes
* (DONE) freeze the \_\_proto\_\_.constructor inside the sandbox (somehow cloudflare design)
* (DONE) using setTimeout to delay waiting for the sandbox done.
* (DONE) Promise/function now auto handled (in max 9 level)
* (DONE) eval() is routed to sandbox too.
* (DONE) import() can be intercepted. (TODO) handover to caller in future
* (DONE) timeout handling to defence ddos attach by codes like: (async()=>{while(1)0})
* (FAIL) works in bun (another js runtime) not yet

thanks to @j4k0xb and @XmiliaH keep sending wonderful cases even being annoyed by me ;)

## application

I use it in my kk project.

## contribution

@j4k0xb, @XmiliaH, and Wanjo (@mgttt)

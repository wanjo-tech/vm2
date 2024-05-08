# Sandbox to replace the discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

## About

a small sandbox run js in ctx, running so far so good.

Main tricks is Host-Object-Protection and Run-In-Worker-Thread.

Challenge still accepted!  If you have escape case, **just show me the code** at the issues(https://github.com/wanjo-tech/vm2/issues/4), I'll investigate and fix ASAP.

## Code

https://github.com/wanjo-tech/vm2/blob/main/jevalx.js

## Test

https://github.com/wanjo-tech/vm2/blob/main/test.js

## Article

* https://github.com/wanjo-tech/vm2/blob/main/en.md

## Used-by

* I use jevalx() in my [kk project](https://github.com/wanjo-tech/kk)

## Next Version

* see if worker_threads not needed (no solution yet)
* see if Proxy version better (baseline without eval())
* performance boosting

## Suggestion

Even the codes are proven-of-concepts and running fine, we still recommend building the production and public-accessible application run inside docker with removal of danger modules such as process and fs in global scope.

## Contribution

Wanjo (@mgttt)

Great thanks to @j4k0xb, @XmiliaH keep sending wonderful cases


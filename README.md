# Replacement for discontinued vm2 (https://github.com/patriksimek/vm2/issues/533)

We post the solution here for your referece.  Challenge still accepted!

## About

Not a full vm, but a sandbox run js in ctx， running so far so good.

## Code

https://github.com/wanjo-tech/vm2/blob/main/jevalx.js

## Quick Test Cases

https://github.com/wanjo-tech/vm2/blob/main/test_jevalx.js

## Article

* https://github.com/wanjo-tech/vm2/blob/main/en.md

## Used by

* I use jevalx() in my kk project.

## Docker/Podman/Container

Even the codes are proven-of-concepts and running fine, we still recommend building the production and public-accessible application run inside docker with removing danger modules such as process and fs in global scope.

## Contribution

@j4k0xb, @XmiliaH, and Wanjo (@mgttt)

Great thanks to @j4k0xb and @XmiliaH keep sending wonderful cases


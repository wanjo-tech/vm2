node test_jevalx.js 2>&1 > test.log
dir pwn*

call node2 --experimental-vm-modules test_jevalx.js 2>&1 > test_vm_import.log
dir pwn*

@echo type test.log
@echo type test_vm_import.log

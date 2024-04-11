@rem node dumptree.js > dumptree.json

node -e "const child = require('child_process').spawn('node', ['dumptree', '>', 'dumptree'+process.version+'.json'],{shell:true}); child.stdout.on('data', data => console.log('' + data)); child.stderr.on('data', data => console.error('STDERR'+data));"

@rem node dumptree_sandbox.js > dumptree_sandbox.json
node -e "const child = require('child_process').spawn('node', ['dumptree_sandbox', '>', 'dumptree_sandbox'+process.version+'.json'],{shell:true}); child.stdout.on('data', data => console.log('' + data)); child.stderr.on('data', data => console.error('STDERR'+data));"

@rem node dumptree_sandbox_dev.js > dumptree_sandbox_dev.json


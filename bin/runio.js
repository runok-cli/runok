#!/usr/bin/env node
const path = require('path');
const signale = require('signale');
const fileName = path.join(process.cwd(), 'runio.js');
const runio = require('../src/command');
const fs = require('fs');

let runioFile;
try {
  runioFile = require(fileName);
} catch (err) {
  signale.fatal(err);
  signale.fatal(`File ${fileName} is not available.\n Create one and export functions for commands`);
  process.exit(1);
}

if (process.versions.node && process.versions.node.split('.') && process.versions.node.split('.')[0] < 8) {
  error('NodeJS >= 8 is required to run.');
  print();
  print('Please upgrade your NodeJS engine');
  print(`Current NodeJS version: ${process.version}`);
  process.exit(1);
}

runioFile.init = () => {
  if (fs.existsSync('runio.js')) {
    signale.note('runio.js file already exists, nothing to init. Just use it.');
    return;
  }
  fs.writeFileSync('runio.js',
`#!/usr/bin/env node
const { runio, exec } = require('runio');

module.exports = {
  async helloWorld() {
    console.log('hello world');
  }
}

if (require.main === module) runio(module.exports);
`  
  );
  fs.chmodSync('runio.js', 0o775);
  signale.info('runio.js file created. Each exported function will be a command');
  signale.info('Execute this file via "./runio.js" or "npx runio"');
}

runio(runioFile);
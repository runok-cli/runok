#!/usr/bin/env node
const path = require('path');
const signale = require('signale');
const fileName = path.join(process.cwd(), 'runok.js');
const runok = require('../src/command');
const fs = require('fs');

let runokFile;

try {
  runokFile = require(fileName);
} catch (err) {
  if (process.argv.pop() === 'init') {
    if (initFn()) return;
  }
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



runok(runokFile);

function initFn() {
  if (fs.existsSync('runok.js')) {
    signale.note('runok.js file already exists, nothing to init. Just use it.');
    return false;
  }
  fs.writeFileSync('runok.js',
`#!/usr/bin/env node
const { runok, exec } = require('runok.js');

module.exports = {
  async helloWorld() {
    console.log('hello world');
  }
}

if (require.main === module) runok(module.exports);
`  
  );
  fs.chmodSync('runok.js', 0o775);
  signale.info('runok.js file created. Each exported function will be a command');
  signale.info('Execute this file via "./runok.js" or "npx runok"');
  return true;
}
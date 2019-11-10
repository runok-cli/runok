# runio - JavaScript replacement for Bash scripts

Are you Bash-Ninja? No?
Why not to write your scripts in pure JavaScript!

## Usage

Write a module that exports commands per function. 

* Each argument of function will be an argument of a command
* If you provide `options` argument, with default value of an object, this will declate options.

```js
#!/usr/bin/env node
const {
  git, exec, npx, runio
} = require('runio');

module.exports = {

  async deploy(env = 'prod') {
    await this.test();
    await git(cmd => {
      cmd.add('-A');
      cmd.commit('releasing');
      cmd.pull();
      cmd.push();      
    });
    await exec(`ansible release ${env}`);
  }

  async test() {
    await npx('mocha');
  },
}

if (require.main === module) runio(module.exports);
```

* Run `./runio.js` to list all available commands
* Run `./runio deploy` to run a deploy script
* Run `./runio deploy staging` to run a deploy script to staging

## Installation

```
npm i runio.js --save
```

Create a new `runio.js` scripts file:

```
npx runio init
```

Each exported function of this file will be command.


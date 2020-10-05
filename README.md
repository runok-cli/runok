# runok

😫 Tired of npm-bash-script-foo?
🤓 Try runok! 

Write your npm scripts in.... 🎉 SURPRISE 🎉... JavaScript!

> runok - is JavaScript replacement for Bash scripts

## Why runok

Everyone ❤️ npm scripts. However, when you need something more sophisticated, 
when you need to use conditionals, loops, regexp and parsers for your scripts, you end up writing JavaScript.

**runok** gives you a tool to transform your JavaScript scripts into commands. 

Each exported function will be a command which can be executed from CLI.
You can use full power of JavaScript & bundled tasks like:

* exec
* git
* npmRun
* npx
* ...and others

## How to use

Write a module that exports commands per function. 

* Each argument of function will be an argument of a command
* If you provide `options` argument, with default value of an object, this will declate options.

```js
#!/usr/bin/env node
const {
  tasks: { git, exec, npx },
  runok
} = require('runok');

module.exports = {

  async deploy(env = 'prod') {
    await this.test();
    await git(cmd => {
      cmd.add('-A');
      cmd.commit('releasing');
      cmd.pull();
      cmd.push();      
    });
    await exec(`ansible-playbook deploy.yml -i hosts ${env}`);
  }

  async test() {
    await npx('mocha');
  },
}

if (require.main === module) runok(module.exports);
```

* Run `./runok` to list all available commands
* Run `./runok deploy` to run a deploy script
* Run `./runok deploy staging` to run a deploy script to staging

## Installation

```
npm i runok --save
```

Create a new `runok` scripts file:

```
npx runok init
```

Each exported function of this file will be command.

## Usage

When file is created execute runok script to see all available commands: 

```
./runok
```

## Credits

Created by Michael Bodnarchuk @davertmik.

Inspired by [Robo PHP Task Runner](https://robo.li)

## LICENSE MIT
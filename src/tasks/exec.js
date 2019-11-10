const { exec } = require('child_process');
const { configure } = require('../task');
const { start, success, fail } = require('../result');

const TASK = 'exec';
const output = require('../output')(TASK);

module.exports = async (command, configFn) => {
  
  let printOutput = true;

  const config = {
    TASK,
    command,
    printOutput: true,

    prefix(prefix) {
      this.command = `${prefix} ${this.command}`;
    },
    
    opt(option, value = '') {
      this.command += ` --${option} ${value}`;
    },

    env(variable, value) {
      this.prefix(`${variable}=${value}`);
    },
    
    arg(arg = '') {
      this.command += ` ${arg}`;
    },
    
    silent(silent = true) {
      this.printOutput = !silent;
    },
  }

  configure(config, configFn);

  return new Promise((resolve, reject) => {
    let result = start(config.TASK, config.command);
    const event = exec(config.command, (error, stdout, stderr) => {
    if (error) {
      Object.assign(result, { stdout, stderr, error });
      return resolve(fail(result));
    }
    resolve(success(result));
   });

   if (config.printOutput) event.stdout.on('data', (data) => console.log(data));
   event.stdout.on('error', (error) => output.error(error));
  });  
}

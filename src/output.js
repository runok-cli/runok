const { Signale } = require('signale');
const chalk = require('chalk');

module.exports = (task) => {
  const options = {
    types: {
      error: {
        label: task.toUpperCase()
      },
      success: {
        label: task.toUpperCase()
      },
      info: {
        label: task.toUpperCase()
      },
      fatal: {
        label: task.toUpperCase()
      }      
    }
  };
  const output = new Signale(options);  
  output.started = function(output = '') {
    this.info(`${chalk.bold(output)}`);    
  }
  return output;
}
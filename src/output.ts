import { Signale } from 'signale';
import chalk from 'chalk';

export function createOutput(task) {

  const options = {
    scope: task.toUpperCase(),
    types: {
      error: {
        label: '',
      },
      success: {
        label: '',
      },
      info: {
        label: '',
      },
      fatal: {
        label: '',
      }      
    }
  };
  const output = new Signale(options);  
  output.started = function(output = '') {
    this.info(`${chalk.bold(output)}`);    
  }
  return output;
}

export function say (...args: any[]) {
  console.log('💬 ' + chalk.green(args.join(' ')))
}

export function yell (...args: any[]) {
  console.log('🗯 ' + chalk.green(args.join(' ').toUpperCase()))
}

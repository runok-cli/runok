const chalk = require('chalk');
const timer = require('timer-node');
const createOutput = require('./output');

const SUCCESS = 'success';
const ERROR = 'error';
const PENDING = 'pending';
let shouldStopOnFail = true;

function stopOnFail(stop = true) {
  shouldStopOnFail = stop;
}

function start(task, print = '') {
  const output = createOutput(task);
  output.started(print);
  const duration = timer(task);
  duration.start();
  return { task, output, duration, status: PENDING };
}

function success(result) {
  result.status = SUCCESS;
  const { output } = result;
  finish(result);
  const duration = result.duration ? chalk.grey(` in ${result.duration.milliseconds()} ms`) : '';
  output.success(`Finished ${duration}`);
  return result;
}

function fail(result) {
  result.status = ERROR;
  const { output } = result;
  finish(result);
  const duration = result.duration ? chalk.grey(` in ${result.duration.milliseconds()} ms`) : '';
  if (result.error) {
    output.fatal(`Failed with "${result.error.message}" ${duration}`);
  } else {
    output.fatal(`Failed ${duration}`);
  }

  if (shouldStopOnFail) {
    output.warn('Execution stopped');
    process.exit(1);
  }
  return result;
}

function finish(result) {
  if (result.duration) result.duration.stop();
}

function wasSuccessful(result) {
  return result.status === SUCCESS;
}

module.exports = {
  start, success, fail, wasSuccessful, 
  stopOnFail,
  statuses: {
    PENDING, SUCCESS, ERROR
  }
};

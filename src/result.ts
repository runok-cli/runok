import chalk from 'chalk';
import { createOutput } from './output';
const Timer = require('timer-node');

enum TaskStatus {
  SUCCESS, ERROR, PENDING
}

export class Result {

  static taskId : number = 0;
  static shouldStopOnFail = true;

  public output: any;
  public duration: any;
  public status: TaskStatus;
  public error: Error;

  data: object;

  constructor(task) {
    this.output = createOutput(`#${Result.taskId} ${task}`);
    this.duration = new Timer(task);
    this.duration.start();
    this.status = TaskStatus.PENDING;
  }

  static start(task : string, print:string = '') {
    Result.taskId += 1;
    const result = new Result(task);
    result.output.started(print);
    return result;
  }

  success(data = {}) : this {
    this.finish();
    this.data = data;
    const duration = this.duration ? chalk.grey(` in ${this.duration.milliseconds()} ms`) : '';
    this.output.success(`Finished ${duration}`);
    return this;
  }

  fail(error, data = {}) {
    this.error = error;
    this.data = data;
    this.finish();
    const duration = this.duration ? chalk.grey(` in ${this.duration.milliseconds()} ms`) : '';
    if (this.error) {
      this.output.fatal(`Failed with "${this.error.message}" ${duration}`);
    } else {
      this.output.fatal(`Failed ${duration}`);
    }
  
    if (Result.shouldStopOnFail) {
      this.output.warn('Execution stopped');
      process.exit(1);
    }
    return this;
  }

  wasSuccessful() {
    return this.status === TaskStatus.SUCCESS;
  }

  private finish() {
    if (this.duration) this.duration.stop();
  }
}

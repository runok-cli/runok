import { TaskConfig } from "../task";
import { Result } from '../result';
import { exec as nodeExec, ExecOptions } from "child_process";

type execConfigType = ExecConfigCallback | TaskExecOptions;

interface TaskExecOptions extends ExecOptions {
  output: boolean;
}

interface ExecConfigCallback { (cfg: ExecConfig):void }


export default async function exec(command:string, config?: execConfigType) : Promise<Result> {

  const cfg = new ExecConfig(command);
  cfg.apply(config);

  return new Promise((resolve, reject) => {
    let result = Result.start(cfg.TASK, cfg.command);
    const event = nodeExec(cfg.command, cfg.execOptions, (error, stdout, stderr) => {
      if (error) {
        Object.assign(result, { stdout, stderr, error });
        return resolve(result.fail(error, { stdout, stderr } ));
      }
      resolve(result.success({ stdout, stderr }));
    });

    process.on('SIGINT', () => {
      process.stdin.resume();
      event.kill('SIGINT');
    });

    if (!event.stdout) return;
    if (cfg.hasOutput) event.stdout.on('data', (data) => process.stdout.write(data));
    if (cfg.hasOutput) event.stdout.on('error', (error) => process.stderr.write(result.output.error(error)));
  });  
}


export class ExecConfig extends TaskConfig {

  TASK = 'exec'
  command : string;
  hasOutput : boolean = true;
  execOptions: ExecOptions;

  constructor(command) {
    super();
    this.command = command;
  }

  applyOptions(opts: TaskExecOptions) {
    this.execOptions = opts;
    if (opts['output'] !== undefined) {
      this.silent(!opts['output']);
    }
  }

  prefix(prefix) {
    this.command = `${prefix} ${this.command}`;
  }
  
  opt(option, value = '') {
    this.command += ` --${option} ${value}`;
  }

  env(variable, value) {
    if (!this.execOptions.env) {
      this.execOptions.env = process.env;
    }
    this.execOptions.env[variable] = value;
    this.prefix(`${variable}=${value}`);
    return this;
  }
  
  arg(arg = '') {
    this.command += ` ${arg}`;
    return this;
  }
  
  silent(silent = true) {
    this.hasOutput = !silent;
    return this;
  }  
}


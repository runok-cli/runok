import { Result } from '../result';
import exec, { ExecConfig } from './exec';

/**
 * Executes npm script
 * 
 * ```js
 * await npmRun('deploy');
 * ```
 * 
 * @param command 
 * @param config 
 */
export default async function npmRun(command, config: ExecConfig) : Promise<Result> {

  return exec(command, (baseCfg: ExecConfig) => {
    baseCfg.TASK = 'npmRun';
    baseCfg.prefix('npm run');
    baseCfg.apply(config);
  });
}

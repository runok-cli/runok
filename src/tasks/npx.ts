import { Result } from '../result';
import exec, { ExecConfig } from './exec';

/**
 * Executes npx script
 * 
 * ```js
 * await npx('create-codeceptjs .');
 * ```
 * 
 * @param command 
 * @param config 
 */
export default async function npx(command, config: ExecConfig) : Promise<Result> {

  return exec(command, (baseCfg: ExecConfig) => {
    baseCfg.TASK = 'npx';
    baseCfg.prefix('npx');
    baseCfg.apply(config);
  });
}

 
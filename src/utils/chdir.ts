/**
 * Changes directory for commands executed in callback function.
 * 
 * ```js
 * // copy file in "base" directory
 * chdir('./base', () => copy('a.txt', 'b.txt')));
 * ```
 * 
 * @param workDir 
 * @param callback 
 */
export default async function chdir(workDir: string, callback: CallableFunction) : Promise<any>  {
  const currentDir = process.cwd();
  process.chdir(workDir);
  let result = await callback();
  process.chdir(currentDir);
  return result;
}

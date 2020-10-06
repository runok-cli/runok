const { Result } = require('../result');
const { copySync } = require('fs-extra');

/**
 * Copies file or directory. copySync from 'fs-extra' is used.
 * 
 * ```js
 * copy('src/', 'dst/');
 * ```
 * 
 * @param from 
 * @param to 
 * @param options 
 */
export default function copy(from: string, to: string, options?: object) {

  const result = Result.start('copy', `${from} => ${to}`);

  try {
    copySync(from, to, options);
  } catch (error) {
    return result.error(error);
  }
  return result.success();
}


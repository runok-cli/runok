import { Result } from '../result';

/**
 * Prevents execution of next tasks on fail:
 * 
 * ```js
 * stopOnFail();
 * ```
 * 
 * Ignore failures and continue:
 * 
 * ```js
 * stopOnFail(false);
 * ```
 * 
 * @param stop 
 */
export default function stopOnFail(stop : boolean = true) {
  Result.shouldStopOnFail = stop;
}


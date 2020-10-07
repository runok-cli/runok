import { TaskConfig } from "../task";
import exec from "./exec";
import { Result } from '../result';

interface gitConfigType { (cfg: GitConfig):void }

/**
 * Provides flexible interface to running multiple git commands:
 * 
 * ```js
 * await git(cmd => {
 *    cmd.pull();
 *    cmd.commit('-m udpated');
 *    cmd.push();
 * })
 * ```
 * 
 * ### Commands API
 * 
 * * `cmd.tag`
 * * `cmd.commit`
 * * `cmd.pull`
 * * `cmd.push`
 * * `cmd.add`
 * * `cmd.clone`
 * * `cmd.cloneShallow`
 * 
 * @param configFn 
 */
export default async function git(configFn: gitConfigType) : Promise<Result> {
  const cfg = new GitConfig();
  cfg.apply(configFn);

  const result = Result.start(cfg.TASK, cfg.commands.map(c => `git ${c}`).join(' && '));

  try {
    for (const command of cfg.commands) {
      await exec(`git ${command}`);
    }
  } catch (error) {
    return result.fail(error);
  }
  return result.success();
}

export class GitConfig extends TaskConfig {
  
  commands : String[] = []
  TASK = 'git';

  tag(tag) {
    this.commands.push(`tag ${tag}`);
    return this;
  }
  commit(message = '') {
    this.commands.push(`commit ${message}`);
    return this;
  }
  pull(branch = '') {
    this.commands.push(`pull ${branch}`);
    return this;
  }
  push(branch = '') {
    this.commands.push(`push ${branch}`);
    return this;
  }
  add(params = '') {
    this.commands.push(`add ${params}`);      
    return this;
  }
  clone(url, path) {
    this.commands.push(`clone ${url} ${path}`);            
    return this;
  }
  cloneShallow(url, path) {
    this.commands.push(`clone ${url} ${path} --depth=1`);      
    return this;
  }
  checkout(params) {
    this.commands.push(`checkout ${params}`);            
    return this;
  }
}


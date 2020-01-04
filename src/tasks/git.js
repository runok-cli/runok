const exec = require('./exec');
const TASK = 'git';
const output = require('../output')(TASK);
const { configure } = require('../task');
const { start, success, fail } = require('../result');

module.exports = async (configFn) => {
  
  const config = {
    commands: [],
    TASK,

    tag(tag) {
      this.commands.push(`tag ${tag}`);
    },
    commit(message = '') {
      this.commands.push(`commit ${message}`);
    },
    pull(branch = '') {
      this.commands.push(`pull ${branch}`);
    },
    push(branch = '') {
      this.commands.push(`push ${branch}`);
    },
    add(params = '') {
      this.commands.push(`add ${params}`);      
    },
    clone(url, path) {
      this.commands.push(`clone ${url} ${path}`);            
    },
    cloneShallow(url, path) {
      this.commands.push(`clone ${url} ${path} --depth=1`);      
    },
    checkout(params) {
      this.commands.push(`checkout ${params}`);            
    },
  }

  configure(config, configFn);

  const result = start(config.TASK, config.commands.map(c => `git ${c}`).join(' && '));

  const results = [];
  try {
    for (const command of config.commands) {
      results.push(await exec(`git ${command}`));
    }
    return success(Object.assign(result, {          
      stdout: results.map(r => r.stdout),
      stderr: results.map(r => r.stderr),
    }));
  } catch (error) {
    console.log(results);
    return fail(Object.assign(result, {
      error,
      stdout: results.map(r => r.stdout),
      stderr: results.map(r => r.stderr),
    }));        
  }
}


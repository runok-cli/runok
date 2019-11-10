const exec = require('./exec');
const TASK = 'git';
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
    push(branch = '') {
      this.commands.push(`push ${branch}`);

    },
    add(params = '') {
      this.commands.push(`add ${params}`);      
    },
    clone(params) {
      this.commands.push(`clone ${params}`);      
      
    },
    checkout(options) {
      this.commands.push(`checkout ${params}`);      
      
    },
    cloneShallow(options) {
      this.commands.push(`clone ${params} --shallow`);      
    },
  }

  configure(config, configFn);

  const result = start(config.TASK);

  const results = [];
  try {
    for (const command of commands) {
      output.info(command);
      results.push(await exec(`git ${command}`, (silent) => silent()));
    }
    return success(Object.assign(result, {          
      stdout: results.map(r => r.data.stdout),
      stderr: results.map(r => r.data.stderr),
    }));
  } catch (error) {
    return fail(Object.assign(result, {
      error,
      stdout: results.map(r => r.data.stdout),
      stderr: results.map(r => r.data.stderr),
    }));        
  }
}


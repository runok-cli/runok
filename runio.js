#!/usr/bin/env node
const { runio, exec, npx, git, replaceInFile, writeToFile } = require('./src');

module.exports = {
  async listActions(one, two = 'this') {
    console.log('listing actions');    
  },

  /**
   * Should deploy an application
   */
  async deployStaging(opts = { silent: false, user: 'should' }) {
    console.log('deploying');
  },
  
  async deployProduction() {
    console.log('deploying');
  },

  async test() {
    await npx('mocha');
  },

  async tryRun() {
    await exec('ls', cmd => cmd.arg('-ll'));
    await npx('parser', cmd => { 
      cmd.arg('.runio.js'); 
      cmd.silent(); 
    });

    await writeToFile('user.json', cmd => {
      cmd.line('----');
      cmd.line('hello world');
      cmd.line('----');
    });

    await git(cmd => {
      cmd.commit();      
    });
  },

  async replace() {
    replaceInFile('file.md', cfg => cfg.replace('word', 'bye'));
  },
  
  async etc() {
    stopOnFail(false);

    await git((add, commit, push) => {
      add('-A');
      commit('updated');
      push();
    });

    stopOnFail(true);

    await exec('codeceptjs', ({ opt }) => opt('plugins', 'allure'))

    await exec('codeceptjs', ({ opt }) => {
      dir('tests');
      opt('plugins', 'allure');
      opt('plugins', 'retryFailedStep');
      opt('profile', 'staging');      
    });

    await chdir('tests', () => exec('codeceptjs'));


    await git().add('-A').commit('init').run();
    await $exec('ls');
    console.log('wow');
  }
}

if (require.main === module) runio(module.exports);

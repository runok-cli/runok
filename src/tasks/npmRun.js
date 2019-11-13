const exec = require('./exec');
const { configure } = require('../task'); 

module.exports = (command, configFn) => {
  return exec(command, function () {
    this.TASK = 'npmRun';
    this.prefix('npm run');
    configure(this, configFn);
  });
}

const exec = require('./exec');
const { configure } = require('../task');

module.exports = (command, configFn) => {

  return exec(command, function () {
    this.TASK = 'npx';
    this.prefix('npx');
    configure(this, configFn);
  });
}

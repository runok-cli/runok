const exec = require('./exec');

module.exports = (command) => {
  return exec(command, function () {
    this.TASK = 'npmRun';
    this.prefix('npm run');
    configure(this, configFn);
  });
}

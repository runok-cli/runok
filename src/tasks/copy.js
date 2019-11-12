const TASK = 'copy';
const { configure } = require('../task');
const { start, success, fail } = require('../result');
const { copySync } = require('fs-extra');

module.exports = (from, to, configFn) => {

  const config = {
    TASK,
    from, to, options: {},
    from(from) {
      this.from = from;
    },

    to(to) {
      this.to = to;
    },   

    overwrite(overwrite = true) {
      this.options.overwrite = overwrite;
    },
  }

  configure(config, configFn);

  const result = start(config.TASK, `${config.from} => ${config.to}`);

  try {
    copySync(config.from, config.to, Object.keys(config.options).length ? config.options || undefined);
    return success(result);
  } catch (error) {
    return fail({ ...result, error });
  }
}

const TASK = 'copy';
const { configure } = require('../task');
const { start, success, fail } = require('../result');
const { copySync } = require('fs-extra');

module.exports = (source, dest, configFn) => {

  const config = {
    TASK,
    source, dest, options: {},
    from(from) {
      this.source = from;
    },

    to(to) {
      this.dest = to;
    },   

    overwrite(overwrite = true) {
      this.options.overwrite = overwrite;
    },
  }

  configure(config, configFn);

  const result = start(config.TASK, `${config.source} => ${config.dest}`);

  try {
    copySync(config.source, config.dest, config.options);
    return success(result);
  } catch (error) {
    return fail({ ...result, error });
  }
}

const { configure } = require('../task');
const { start, success, fail } = require('../result');
const fs = require('fs');
const path = require('path');

const TASK = 'replaceInFile';

module.exports = (file, configFn) => {
  
  const config = {
    
    TASK,
    file,
    replace: [],
    
    replace(from, to) {
      this.replace.push({
        from, to
      });
    }
  }
  
  config.file = path.join(process.cwd(), file);
  configure(config, configFn);
  
  const result = start(config.TASK, config.file);

  let data;
  try {
    data = fs.readFileSync(file).toString();
    for (const r of this.replace) {
      data = data.replace(r.from, r.to);
    }
    fs.writeFileSync(file, data);
  } catch (err) {
    return fail({ ...result, error });
  }
  return success({ ...result, data });
}

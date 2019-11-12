const { configure } = require('../task');
const { start, success, fail } = require('../result');
const fs = require('fs');
const path = require('path');

const TASK = 'replaceInFile';

module.exports = (file, configFn) => {
  
  const config = {
    
    TASK,
    file,
    replaceList: [],
    
    replace(from, to) {
      this.replaceList.push({
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
    for (const r of config.replaceList) {
      data = replaceAll(data, r.from, r.to);
    }
    fs.writeFileSync(file, data);
  } catch (error) {
    return fail({ ...result, error });
  }
  return success({ ...result, data });
}

function replaceAll(string, from, to) {
  if (typeof from === 'string') {
    return string.split(from).join(to);
  }
  return string.replace(from, to);
}
const fs = require('fs');
const path = require('path');
const TASK = 'writeToFile';
const { configure } = require('../task');
const { start, success, fail } = require('../result');

module.exports = (file, configFn) => {
  
  file = path.join(process.cwd(), file);

  const config = {
    
    TASK,
    file,
    text: '',

    textFromFile(file) {
      this.text += fs.readFileSync(path.join(process.cwd(), file));
    },

    line(line) {
      this.text += `${line}\n`;
    },

    append(text) {
      this.text += text;
    },
  }
    
  configure(config, configFn);
  
  const result = start(config.TASK, config.file);
  
  try {
    fs.writeFileSync(config.file, config.text);
  } catch (error) {
    return fail({ ...result, error });
  }
  return success({ ...result, data: config.text });
}


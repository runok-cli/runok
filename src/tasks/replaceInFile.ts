import { TaskConfig } from '../task';
import { Result } from '../result';

const fs = require('fs');
const path = require('path');

interface replaceInFileCallback { (cfg: ReplaceInFileConfig):void }

export default function replaceInFile(file: string, configFn: replaceInFileCallback) : Result {

  const config = new ReplaceInFileConfig(file);
  config.apply(configFn);

  const result = Result.start(config.TASK, config.file);
  
  let data;
  try {
    data = fs.readFileSync(file).toString();
    for (const r of config.replaceList) {
      data = replaceAll(data, r['from'], r['to']);
    }
    fs.writeFileSync(file, data);
  } catch (error) {
    return result.fail(error);
  }
  return result.success();
}


class ReplaceInFileConfig extends TaskConfig {
    
  TASK = 'replaceInFile';
  replaceList : object[] = [];

  constructor(public file : string) {
    super();
  }

  
  replace(from, to) {
    this.replaceList.push({
      from, to
    });
  }
}  


function replaceAll(string, from, to) {
  if (typeof from === 'string') {
    return string.split(from).join(to);
  }
  return string.replace(from, to);
}

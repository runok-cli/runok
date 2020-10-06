import { TaskConfig } from '../task';
import { Result } from '../result';

const fs = require('fs');
const path = require('path');

interface writeToFileCallback { (cfg: WriteToFileConfig):void }

/**
 * Writes a data to file. 
 * 
 * Takes file name as first argument and config function as second.
 * 
 * ```js
 * writeToFile('blog-post.md', cfg => {
 *    cfg.line('---');
 *    cfg.line('title: My blogpost');
 *    cfg.line('---');
 *    cfg.line();
 *    cfg.textFromFile('blog-post.txt');
 *    cfg.text += '// copyright by me';
 * });
 * ```
 * 
 * A second argument is a config function that passes in an object for text manipulation.
 * 
 * ### Config API
 * 
 * * `cfg.text` - string to be written to file
 * * `cfg.textFromFile(file)` - loads a file and append its context to text
 * * `cfg.line(text)` - appends a string to a text with "\n" after
 * * `cfg.append(text)` - appends a string to a text
 */
export default function writeToFile(file: string, configFn: writeToFileCallback) : Result {
  
  file = path.join(process.cwd(), file);

  const config = new WriteToFileConfig(file);
  config.apply(configFn);

  const result = Result.start(config.TASK, config.file);
  
  try {
    fs.writeFileSync(config.file, config.text);
  } catch (error) {
    return result.fail(error);
  }
  return result.success({ text: config.text });
}


class WriteToFileConfig extends TaskConfig {

  TASK = 'writeToFile';
  public file;
  public text;
  
  constructor(file) {
    super();
    this.file = file;
    this.text = '';
  }

  textFromFile(file: string) {
    this.text += fs.readFileSync(path.join(process.cwd(), file));
  }

  line(line: string) {
    this.text += `${line}\n`;
  }

  append(text: string) {
    this.text += text;
  }

}

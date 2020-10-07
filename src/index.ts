import runok from './command';
import chdir from './utils/chdir';
import stopOnFail from './utils/stopOnFail';
import { say, yell } from './output';
import exec from './tasks/exec';
import npx from './tasks/npx';
import npmRun from './tasks/npmRun';
import copy from './tasks/copy';
import replaceInFile from './tasks/replaceInFile';
import writeToFile from './tasks/writeToFile';
import git from './tasks/git';




export = {
  chdir,
  tasks: {
    exec,
    npx,
    npmRun,
    copy,
    git,
    replaceInFile,
    writeToFile,  
  },
  output: {
    say, yell
  },
  stopOnFail,
  runok
}

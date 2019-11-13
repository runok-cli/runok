const runio = require('./command');
const exec = require('./tasks/exec');
const { stopOnFail } = require('./result');
const npx = require('./tasks/npx');
const npmRun = require('./tasks/npmRun');
const copy = require('./tasks/copy');
const replaceInFile = require('./tasks/replaceInFile');
const writeToFile = require('./tasks/writeToFile');
const git = require('./tasks/git');

async function chdir(workDir, callback)  {
  const currentDir = process.cwd();
  process.chdir(workDir);
  await callback();
  process.chdir(currentDir);
}

module.exports = {
  tasks: {
    chdir,
    exec,
    npx,
    npmRun,
    copy,
    git,
    replaceInFile,
    writeToFile,  
  },
  chdir,
  exec,
  npx,
  npmRun,
  copy,
  git,
  replaceInFile,
  writeToFile,
  stopOnFail,
  runio 
}

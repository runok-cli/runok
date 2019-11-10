const runio = require('./command');
const exec = require('./tasks/exec');
const npx = require('./tasks/npx');
const npmRun = require('./tasks/npmRun');
const copy = require('./tasks/copy');
const replaceInFile = require('./tasks/replaceInFile');
const writeToFile = require('./tasks/writeToFile');
const git = require('./tasks/git');

async function chdir(workDir, callback)  {
  const currentDir = process.cwd();
  process.cwd(workDir);
  await callback();
  process.cwd(currentDir);
}

module.exports = {
  chdir,
  exec,
  npx,
  npmRun,
  copy,
  git,
  writeToFile,
  runio 
}

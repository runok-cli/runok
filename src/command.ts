const program = require('commander');
const signale = require('signale');
const babelParser = require('@babel/parser');
const fs = require('fs');
const path = require('path');
let parser = require('parse-function')();

program.usage('<command> [options]');
program.version(1);

export default function (commands) {


  const exportCommand = program.command('export:npm');
  exportCommand.description('Exports runok scripts to package.json')
  exportCommand.action(exportFn);


  Object.keys(commands).forEach(fnName => {
    let fnBody = commands[fnName].toString();
    fnBody = `async function ${fnBody.trim().replace(/^async\s/, '')}`; 
    let refl;
    try {
      refl = parser.parse(fnBody);
    } catch (err) {
      throw new Error(`Can't parse ${fnName}:\n----\n${fnBody}\n----\n\n${err}`);
    }
    const defaults = refl.defaults;
  
    const options = defaults.opts || defaults.options || null;
    delete defaults.opts;
    delete defaults.options;
    delete refl.args.opts;
    delete refl.args.options;
  
    const args = refl.args.map(arg => {
      if (defaults[arg]) return `[${arg}]`;
      return `<${arg}>`;
    });
  
    const command = program.command(`${prepareCommandName(fnName)} ${args.join(' ')}`);
    if (options) {
      const parsedOptions = eval(`(${options})`);
      Object.keys(parsedOptions).forEach(opt => {
        const value = parsedOptions[opt];
        if (value === false || value === null) command.option(`--${opt}`); 
        command.option(`--${opt} [${opt}]`);
      });
    }
    command.description(parseComments(fnBody).trim());
  
    command.action(commands[fnName].bind(commands));
  });

  program.on('command:*', (cmd) => {
    console.log(`\nUnknown command ${cmd}\n`);
    program.outputHelp();
  });
  
  if (process.argv.length <= 2) {
    program.outputHelp();
  }
  program.parse(process.argv);
} 

function prepareCommandName(name) {
  name = name.split(/(?=[A-Z])/).join('-').toLowerCase();
  return name.replace('-', ':');
}

function parseComments(source) {
  const ast = babelParser.parse(source);
  const comments = ast.comments.map(c => c.value);
  return comments[0] || '';
}

function exportFn() {
  if (!fs.existsSync('runok.js')) {
    signale.error('runok.js file not found, can\'t export its commands.');
    return false;
  }

  if (!fs.existsSync('package.json')) {
    signale.error('package.json now found, can\'t set scripts.');
    return false;
  }

  const pkg = JSON.parse(fs.readFileSync('package.json').toString());
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  const tasks = Object.keys(require(path.join(process.cwd(), 'runok.js')));
  
  // cleanup from previously exported
  for (let s in pkg.scripts ) {
    if (pkg[s] && pkg[s].startsWith('./runok.js')) delete pkg[s];
  }

  const scripts = Object.fromEntries(tasks.map(prepareCommandName).map(k => [k, './runok.js '+k]));

  pkg.scripts = {...pkg.scripts, ...scripts };

  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 4));

  console.log('Added scripts:');
  console.log();

  Object.keys(scripts).forEach(k => console.log('   npm run ' + k));

  console.log();
  signale.info('package.json updated');
  signale.info(`${Object.keys(scripts).length} scripts exported`);
  return true;
}

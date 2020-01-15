const program = require('commander');
const babelParser = require('@babel/parser');
let parser = require('parse-function')();

program.usage('<command> [options]');
program.version(1);

module.exports = (commands) => {

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
    command.description(parseComments(fnBody));
  
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

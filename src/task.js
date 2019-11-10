const configure = (config, configFn) => {
  if (!configFn) return;
  configFn.call(config, config);
}

const result = {  
}

module.exports = {
  result, configure
}
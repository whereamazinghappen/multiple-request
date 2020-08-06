const chalk = require('chalk');
const { config } = require('../config');

function log (status, text) {
  switch (status) {
    case 'success':
      console.log(chalk.green(text));
      break;
    case 'error':
      console.log(chalk.red(text));
      break;
  
    default:
      console.log(chalk.blue(text));
      break;
  }
}

module.exports = { log }

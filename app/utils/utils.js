const chalk = require('chalk');

exports.now = () => new Date().toJSON().slice(0,19).replace(/-/g,'/').replace('T',' ');

exports.dumpError = (err) => {
    if (typeof err === 'object') {
        if (err.message) {
            console.log(chalk.red('\nMessage: ' + err.message));
        }
        if (err.stack) {
            console.log(chalk.blue('\nStacktrace:\n===================='));
            console.log(chalk.yellow(err.stack));
            console.log(chalk.blue('===================='));
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
};
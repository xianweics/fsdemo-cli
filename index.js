#! /usr/bin/env node
const info = console.info;

const ora = require('ora');
const path = require('path');
const pg = require('./package');
const colors = require('colors');
const figlet = require('figlet');
const shell = require('shelljs');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const commander = require('commander');

// Output the project name
const name = figlet.textSync(pg.name.toUpperCase());
info(colors.green(name));

// Setting commander
commander
  .version(pg.version)
  .option('-i, --init', 'init project')
  .parse(process.argv);

inquirer.prompt([
  {
    type: 'text',
    name: 'directory',
    message: 'Please input your directory'
  }
]).then(answers => {
  const { directory } = answers;
  const pwdDir = shell.pwd().stdout;
  
  // Setting download directory of the project
  const projectPath = path.join(pwdDir, directory);
  shell.rm('-rf', projectPath);
  shell.mkdir(projectPath);
  
  const remoteSourceName = pg.resource.fullStack.name;
  const remoteSourceUrl = pg.resource.fullStack.url;
  const spinner = ora(`Download ${remoteSourceName}...\n`);
  spinner.start();
  
  // Start to download remote source code
  download(`direct:${remoteSourceUrl}`, projectPath, { clone: true }, err => {
    if (err) {
      info(err);
      process.exit(1);
    }
    spinner.succeed(`The ${remoteSourceName} is downloaded successfully`);
  });
}).catch(err => {
  info('fail start', err);
});

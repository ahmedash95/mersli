#!/usr/bin/env node
"use strict";
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
clear();
console.log(chalk.red(figlet.textSync('Mersli', { horizontalLayout: 'full' })));
program
    .version('0.0.1')
    .description("Make slides from your mermaid diagrams")
    .option('-i, --input <path>', 'Input file')
    .option('-p', '--port <port>', 'Port to start the server on', 3000)
    .parse(process.argv);

#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs = require('fs');
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
function watchFile(filePath) {
    var watcher = chokidar.watch(filePath, {
        persistent: true
    });
    watcher.on('change', function (path) {
        console.log("File ".concat(path, " has been changed"));
        browserSync.reload();
    });
}
clear();
console.log(chalk.red(figlet.textSync('Mersli', { horizontalLayout: 'full' })));
program
    .version('0.0.1')
    .description("Make slides from your mermaid diagrams")
    .option('-i, --input <path>', 'Input file')
    .option('-p, --port <port>', 'Port to start the server on', 3000)
    .option('-a, --auto-open', 'Auto open the browser', true)
    .parse(process.argv);
if (process.argv.slice(2).length === 0) {
    program.outputHelp();
    process.exit(0);
}
var options = program.opts();
if (!options.input) {
    console.log(chalk.red("Input file is required"));
    process.exit(1);
}
// get the input file
var input = options.input;
var filePath = path.resolve(input);
// validate the input file
if (!fs.existsSync(filePath)) {
    console.log(chalk.red("File ".concat(filePath, " does not exist")));
    process.exit(1);
}
// Starting the server
var port = options.port;
var app = (0, express_1.default)();
var http = require('http').Server(app);
var chokidar = require('chokidar');
var browserSync = require('browser-sync').create();
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './views/index.html'));
});
app.get('/data', function (req, res) {
    var content = fs.readFileSync(filePath, 'utf8');
    var json = JSON.parse(content);
    res.send(json);
});
http.listen(port, function () {
    console.log("Server listening on http://localhost:".concat(port));
});
watchFile(filePath);
browserSync.init({
    proxy: "localhost:".concat(port),
    files: ['views/index.html'],
    open: options.autoOpen
});

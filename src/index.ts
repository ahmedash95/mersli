#!/usr/bin/env node

import express, { Request, Response } from 'express';

const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

function watchFile(filePath: string) {
    const watcher = chokidar.watch(filePath, {
        persistent: true
    });

    watcher.on('change', (path: string) => {
        console.log(`File ${path} has been changed`);
        browserSync.reload();
    });
}


clear();

console.log(
    chalk.red(
        figlet.textSync('Mersli', { horizontalLayout: 'full' })
    )
);

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

const options = program.opts();

if(!options.input) {
    console.log(chalk.red(`Input file is required`))
    process.exit(1)
}

// get the input file
const input = options.input
const filePath = path.resolve(input)
// validate the input file
if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`File ${filePath} does not exist`))
    process.exit(1)
}

// Starting the server
const port = options.port

const app = express();
const http = require('http').Server(app);
const chokidar = require('chokidar');
const browserSync = require('browser-sync').create();

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
})

app.get('/data', (req: Request, res: Response) => {
    const content = fs.readFileSync(filePath, 'utf8')
    const json = JSON.parse(content)

    res.send(json)
})

http.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
});

watchFile(filePath);

browserSync.init({
    proxy: `localhost:${port}`,
    files: ['views/index.html'],
    open: options.autoOpen
});

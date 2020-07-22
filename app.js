'use strict';

const express = require('express');
const parser = require('body-parser');
const http = require('http');
const fs = require('fs');
const csv = require('csv-parser')

const pjson = require(__dirname + '/package.json');

module.exports = start();

function start() {

    const app = express();
    const server = http.Server(app);

    app.use(parser.json());
    app.use(parser.urlencoded({ extended: true }));

    app.get('/read_csv', (req, res) => {

        const results = [];
        fs.createReadStream('data.csv')
        .pipe(csv({
            separator: ';',
            mapHeaders: ({ header, index }) => {
                if (index == 0) return 'id';
                if (index == 1) return 'body';
                if (index == 2) return 'status';
            },
            mapValues: ({ header, index, value }) => {
                return index == 0 ? Number(value): value;
            }
        }))
        .on('data', data => results.push(data))
        .on('end', () => {
            res.status(200).send({ data: results });
        });
    });

    app.get('*', (req, res) => {
        res.status(200).send({ message: 'Nothing to do here.' });
    });

    const configPort = 4776;

    server.listen(configPort, () => {
        console.log(
            `\nListening on port: ${configPort}\nRunning on http connection\nApp Version: ${pjson.version}\n`
        );
    });

    return app;
}
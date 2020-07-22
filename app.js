'use strict';

const express = require('express');
const parser = require('body-parser');
const http = require('http');
const fs = require('fs');

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
        .on('data', data => {
            const buffer = Buffer.from(data);
            const str = buffer.toString();
            const rows = str.split('\n');

            const headers = rows.shift();
            const hdr_cmp = headers.split(';');

            // console.log('headers: ', headers);

            if (rows.length > 0 && rows[rows.length - 1].length == 0) {
                rows.pop();
            }

            const parsed = rows.map(e => {
                const row = e.replace(/"/g, '');
                const cmp = row.split(';');
                // console.log('components: ', cmp);

                return { [hdr_cmp[0]]: Number(cmp[0]), [hdr_cmp[1]]: cmp[1], [hdr_cmp[2]]: cmp[2] };
            })

            results.push(parsed)
        })
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
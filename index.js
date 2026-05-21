const express = require('express')
const app = express()
const fs = require('fs');

app.use(express.json());

const dataFolder = './data';
const logFilePath = `${dataFolder}/logData.json`;
let data;

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

if (fs.existsSync(logFilePath)) {
    
    try {
        const json = JSON.parse(fs.readFileSync(logFilePath));
        data = Array.isArray(json) ? json : [];
    } catch (error) {
        console.error('Error parsing log data:', error);
        data = [];
    }

} else {
    data = [];
}

const writeLogFile = (logData) => {
    fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
};

app.use((req, res, next) => {

    const requestData = {
        body: req.body,
        uri: req.originalUrl,
        headers: req.headers,
        method: req.method,
        timestamp: new Date()
    };

    if (requestData.uri == '/logger' && requestData.method == 'GET') {
        return res.status(200).json(data);
    }

    data.push(requestData);
    writeLogFile(data);
    res.status(200).send('OK');

});

app.listen(3000);
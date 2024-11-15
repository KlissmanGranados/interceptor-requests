const express = require('express')
const app = express()
const fs = require('fs');

app.use(express.json());

const logFilePath = './data/logData.json';

const readLogFile = () => {
    if (fs.existsSync(logFilePath)) {
        const data = fs.readFileSync(logFilePath);
        return JSON.parse(data);
    }
    return [];
};

const writeLogFile = (logData) => {
    fs.writeFileSync(logFilePath, JSON.stringify(logData));
};

app.use((req, res, next) => {

    let logData = readLogFile();

    const requestData = {
        body: req.body,
        uri: req.originalUrl,
        headers: req.headers,
        method: req.method,
        timestamp: new Date()
    };
    
    if(requestData.uri == '/logger' && requestData.method == 'GET') {
        res.status(200).json(readLogFile());
    } else {
        logData.push(requestData);
        writeLogFile(logData);
        res.status(200).send('OK');
    }

});

app.listen(3000);
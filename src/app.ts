import express = require('express');
import cluster = require('cluster');
import child_process = require('child_process');
import os = require('os');
import puppeteer = require('puppeteer');
import routes from "./routes";

const app: express.Application = express();
const spawn = child_process.spawn;
const numOfWorkers = os.cpus().length;

const PORT = 1000;
const ENV = process.env.NODE_ENV || 'dev';
const USE_CLUSTER = process.env.CLUSTER || true;


export const runServer = () => {
    
    app.use('/', routes);
    
    app.listen(PORT, function () {
        console.log({
            type: 'INFO',
            message: 'Listening to PORT ' + PORT
        });
    });
}

export const createCluster = () => {
    if (cluster.isMaster) {
        console.log({
            type: 'INFO',
            message: 'Master cluster is setting up ' + numOfWorkers + ' workers'
        });

        cluster.on('online', (worker) => {
            console.log({
                type: 'INFO',
                message: 'Worker with process id: ' + worker.process.pid + ' is ONLINE'
            });
        });

        cluster.on('exit', (worker, code, signal) => {
            console.log({
                type: 'INFO',
                message: 'Worker with process id: ' + worker.process.pid + ' is DIED with code ' + code + 'and signal ' + signal + '. Starting a new worker...'
            });
            cluster.fork();
        });

        for (let i = 0; i < numOfWorkers; i++) {
            cluster.fork();
        }

    } else {
        runServer();
    }
}

export const initServer = () => {
    if (USE_CLUSTER) {
        createCluster();
    }else {
        runServer();
    }
}

initServer();
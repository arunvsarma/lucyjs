"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cluster = require("cluster");
var child_process = require("child_process");
var os = require("os");
var routes_1 = __importDefault(require("./routes"));
var app = express();
var spawn = child_process.spawn;
var numOfWorkers = os.cpus().length;
var PORT = 1000;
var ENV = process.env.NODE_ENV || 'dev';
var USE_CLUSTER = process.env.CLUSTER || true;
exports.runServer = function () {
    app.use('/', routes_1.default);
    app.listen(PORT, function () {
        console.log({
            type: 'INFO',
            message: 'Listening to PORT ' + PORT
        });
    });
};
exports.createCluster = function () {
    if (cluster.isMaster) {
        console.log({
            type: 'INFO',
            message: 'Master cluster is setting up ' + numOfWorkers + ' workers'
        });
        cluster.on('online', function (worker) {
            console.log({
                type: 'INFO',
                message: 'Worker with process id: ' + worker.process.pid + ' is ONLINE'
            });
        });
        cluster.on('exit', function (worker, code, signal) {
            console.log({
                type: 'INFO',
                message: 'Worker with process id: ' + worker.process.pid + ' is DIED with code ' + code + 'and signal ' + signal + '. Starting a new worker...'
            });
            cluster.fork();
        });
        for (var i = 0; i < numOfWorkers; i++) {
            cluster.fork();
        }
    }
    else {
        exports.runServer();
    }
};
exports.initServer = function () {
    if (USE_CLUSTER) {
        exports.createCluster();
    }
    else {
        exports.runServer();
    }
};
exports.initServer();

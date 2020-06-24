
const express = require('express');
const cluster = require('cluster');
const spawn = require('child_process').spawn;
const numOfWorkers = require('os').cpus().length;
const puppeteer = require('puppeteer');
const puppeteerCore = require('puppeteer-core');
const app = express();

const PORT = 1000;
const ENV = process.env.NODE_ENV || 'dev';
const USE_CLUSTER = process.env.CLUSTER || true;

runServer = () => {

    app.get('/lucy/test', (req, res, next) => {
        (async () => {
            const browser = await puppeteer.launch({
                args: [
                    '--encode-binary',
                    '--no-sandbox',
                    '--disable-web-security',
                    '--ignore-certificate-errors',
                    '--enable-font-antialiasing'
                ],
                headless: true,
                ignoreHTTPSErrors: true,
                timeout: 0,
                devtools: false
            });
            const page = await browser.newPage();
            // await page.setRequestInterception(true);
            // const metrics = await page.metrics();
            // console.info(metrics);
           
            // page.on('request', async interceptedRequest => {
            //     console.log(interceptedRequest.metrics)
            //     console.log(await interceptedRequest.url());
                
            //     interceptedRequest.continue();
            // })

            // try {
            //     await page.goto('https://myapp.sqa.com/', { waitUntil: 'networkidle2' });
            //     await page.type('#username', 'testuser');
            //     await page.click('.form-button');
            //     await page.waitForNavigation({ waitUntil: 'networkidle0'});
            //     console.log('********* NEW URL ' + page.url())
            //     // await page.waitForSelector('title');
            //     const metrics = await page.evaluate( () => JSON.stringify(window.performance.getEntries()) )
            //     res.send(metrics)
            // } catch (err) {
            //     console.log("Something went wrong with page request ", err)
            //     res.send(err);
            // } finally {
            //     // await browser.close();
            // }

            try {
                await page.goto('https://www.google.com', { waitUntil: 'networkidle0' });
                await page.waitForSelector('title');
                const metrics = await page.evaluate(() => JSON.stringify(window.performance.getEntries()));
                console.info(JSON.parse(metrics));
            } catch (ex) {
                console.log(ex)
                res.end(ex);
            } finally {
                await browser.close();
                res.send('DONE');
            }
            
          })();
    })

    app.get('/lucy', (req, res, next) => {
        res.send('Lucy says - Hi!');
    })

    app.listen(PORT, () => {
        console.log({
            type: 'INFO',
            message: 'Listening to PORT ' + PORT
        });
    })
}

createCluster = () => {
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

initServer = () => {
    if (USE_CLUSTER) {
        createCluster();
    }else {
        runServer();
    }
}



initServer();
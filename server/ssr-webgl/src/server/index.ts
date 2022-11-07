import express from 'express';

import cors from 'cors';
import router from './routes';
import { PORT, validateConfig } from '../utils/config';
import { Server } from 'net';
import logger from '../utils/logger';
import { grabber } from './grabber';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        exposedHeaders: ['x-request-id'],
    }),
);

app.use(router);

function listen(port: number): Promise<Server> {
    return new Promise((resolve, reject) => {
        const server = app.listen(port);
        server
            .once('listening', () => {
                resolve(server);
            })
            .once('error', (err) => {
                reject(err);
            });
    });
}

export async function startServer() {
    try {
        if (!validateConfig()) throw new Error('Missing configuration!');
        
        await grabber.initialize();
        await listen(PORT);

        console.log(`🚀 Server running on port ${PORT}`);
    } catch (e) {
        logger.error('Server start error!');
    }
}

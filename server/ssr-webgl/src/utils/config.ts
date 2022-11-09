import path from 'path';
import env from 'dotenv';
env.config({ path: path.resolve(`./.env`) });

import logger from './logger';

export const PORT = 8080;

const { ROOT_LOG_LEVEL } = process.env;

export const config = {
    logLevel: ROOT_LOG_LEVEL,
};

export function validateConfig(): boolean {
    const validate = Object.entries(config).map((entry) => {
        if (entry[1]) return true;
        logger.error(`Missing ${entry[0]} value!`);
        return false;
    });
    return !validate.some((cfg) => !cfg);
}

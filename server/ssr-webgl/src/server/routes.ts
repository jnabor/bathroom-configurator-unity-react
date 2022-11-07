import * as express from 'express';

import logger from '../utils/logger';
import { grabber } from './grabber';

const router: express.Router = express.Router();

type Cfg = 'cfg1' | 'cfg2' | 'cfg3';
type GetCfg = {
    cfg: Cfg;
};

router.get('/', (req, res) => {
    logger.info('Received root request');
    res.status(200).send({ res: "online" });
});

router.get<GetCfg>('/image/:cfg', async (req, res) => {
    logger.info('Received image request');

    const cfg = req.params.cfg.slice(0, 1);
    const buffer = await grabber.getImage(cfg)

    if (buffer) {
        res.contentType('image/jpg');
        res.status(200).send(buffer);
        return;
    }

    res.status(400).send();
});

export default router;

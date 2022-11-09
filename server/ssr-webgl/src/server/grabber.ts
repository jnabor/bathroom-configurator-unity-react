import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
import logger from '../utils/logger';

const chromePath = process.env.CHROME_EXECUTABLE_PATH || ''
const url = 'https://bathroom-configurator-urp.netlify.app/';
const canvasSelector = '#react-unity-webgl-canvas-1';

class Grabber {
    static instance: Grabber;
    private browser: Browser;
    private page: Page;
    private canvas: ElementHandle<Element> | null = null;

    private constructor() {}

    public async initialize() {
        logger.info('Initializing grabber...');

        try {
            this.browser = await puppeteer.launch({
                ...(chromePath && {executablePath: chromePath}),
                headless: true,
                timeout: 60000,
                args: [
                    '--disable-extensions',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });
        } catch (e) {
            logger.info('ERROR puppeteer launch', e);
            throw e;
        }

        this.page = await this.browser.newPage();

        await this.page.goto(url, { waitUntil: 'networkidle2' });
        await this.page.waitForSelector(canvasSelector);

        this.canvas = await this.page.$(canvasSelector);
        logger.info('Grabber initialized...');
    }

    public async getImage(cfgId: string): Promise<string | Buffer> {
        if (!this.canvas) return '';

        const els = await this.page.$(`#\\3${cfgId}`);
        els && (await els.click());

        const imageBuffer = await this.canvas.screenshot({
            type: 'jpeg',
            quality: 100,
            omitBackground: true,
        });

        logger.info('Image generated');
        return imageBuffer;
    }

    public static getInstance(): Grabber {
        if (!Grabber.instance) {
            Grabber.instance = new Grabber();
        }
        return Grabber.instance;
    }
}

export const grabber = Grabber.getInstance();

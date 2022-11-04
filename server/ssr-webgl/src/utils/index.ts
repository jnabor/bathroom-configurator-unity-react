
import { PORT, config, validateConfig } from "./config";
import logger from "./logger";

export { PORT, config, validateConfig };
export { logger };

export const encodeHex = (str: string) =>
    str
        .split("")
        .map((char) => char.charCodeAt(0).toString(16))
        .join("") || "";

export const decodeHex = (str: string) =>
    (str.match(/.{1,2}/g) || [])
        .map((code) => String.fromCharCode(parseInt(code, 16)))
        .join("") || "";

export const toProperCase = (str:string) => {
    if(!str) return null;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export function delayMs(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), ms);
    });
}
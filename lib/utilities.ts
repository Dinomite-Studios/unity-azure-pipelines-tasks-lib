import { OS } from "./models";
import sanitize from 'sanitize-filename';

/**
 * Utility class with miscellaneous utility functions.
 */
export class Utilities {

    /**
     * Gets the platform the node proces is running on.
     * @returns Operating System identifier.
     */
    public static getOS(): OS {
        if (process.platform === 'win32') {
            return OS.Windows;
        }

        if (process.platform === 'darwin') {
            return OS.MacOS;
        }

        if (process.platform === 'linux') {
            return OS.Linux;
        }

        throw new Error('Platform is not supported!');
    }

    /**
     * Pauses process execution for a given time.
     * @param ms Sleep duration in milliseconds.
     */
    public static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    /**
     * Generates a timestamp string for use in a logfile filename.
     * @returns Valid cross-platform filename timestamp.
     */
    public static getLogFileNameTimeStamp(): string {
        const now = new Date();
        const year = "" + now.getFullYear();

        let month = "" + (now.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }

        let day = "" + now.getDate();
        if (day.length == 1) {
            day = "0" + day;
        }

        let hour = "" + now.getHours(); if (hour.length == 1) {
            hour = "0" + hour;
        }

        let minute = "" + now.getMinutes(); if (minute.length == 1) {
            minute = "0" + minute;
        }

        let second = "" + now.getSeconds(); if (second.length == 1) {
            second = "0" + second;
        }

        return sanitize(`${year}-${month}-${day}-${hour}-${minute}-${second}`);
    }
}
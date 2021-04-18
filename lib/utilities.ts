import { OS } from "./models";

/**
 * Utility class with miscellaneous utility functions.
 */
export class Utilities {

    /**
     * Gets the platform the node proces is running on.
     * 
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
     * 
     * @param ms Sleep duration in milliseconds.
     */
    public static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
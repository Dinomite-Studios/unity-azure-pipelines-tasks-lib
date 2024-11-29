// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import tail from 'tail';

/**
 * Watches the unity log output and streams it back to the console.
 */
export class UnityLogStreamer {

    private static logTail: tail.Tail | null | undefined;

    private static printOpen(): void {
        console.log("================================ UNITY LOG ===================================")
    }

    private static printClose(): void {
        console.log("=============================== UNITY LOG END ================================");
    }

    /**
     * Streams the contents of a given Unity logfile to the console.
     * @param logFilePath The path to the log file that should be streamed to console.
     */
    public static startStreaming(logFilePath: string): void {
        try {
            UnityLogStreamer.printOpen();

            UnityLogStreamer.logTail = new tail.Tail(logFilePath, {
                fromBeginning: true,
                follow: true,
                logger: console,
                useWatchFile: true,
                flushAtEOF: true,
                fsWatchOptions: {
                    interval: 1009
                }
            });

            UnityLogStreamer.logTail.on("error", (error) => {
                console.error('ERROR: ', error);
            });

            UnityLogStreamer.logTail.on("line", (data) => {
                console.log(data);
            });
        } catch (e) {
            UnityLogStreamer.stopStreaming();

            if (e instanceof Error) {
                console.error(e.message);
            } else {
                console.error(e);
            }
        }
    }

    /**
     * Stops streaming the contents of a Unity logfile to the console.
     */
    public static stopStreaming(): void {
        if (UnityLogStreamer.logTail) {
            UnityLogStreamer.logTail.unwatch();
            UnityLogStreamer.printClose();
        }

        UnityLogStreamer.logTail = null;
    }
}

// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import fs from 'fs';
import { ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { UnityLogStreamer } from './unity-log-streamer';
import { Utilities } from './utilities';

/**
 * The unity tool runner wraps the azure pipelines task lib tool runner
 * and adds log streaming to the console.
 */
export class UnityToolRunner {

    /**
     * Executes the provided tool runner (cmd) and streams the Unity
     * log to the console.
     * @param tool The configured Unity cmd tool runner instance.
     * @param logFilePath Log file path to monitor and stream to console.
     * @returns Unity exit code.
     */
    public static async run(tool: ToolRunner, logFilePath: string): Promise<number> {
        let resultPending = true;
        let execResult = -1;

        // Run the Unity command line.
        tool.execAsync().then((value) => {
            execResult = value;
            resultPending = false;
        }).catch((error) => {
            console.error(error);
            resultPending = false;
        });

        try {
            // Wait for the log file to be created.
            let waitedLoops = 0;
            const maxLoops = 5;
            while (!fs.existsSync(logFilePath) && waitedLoops < maxLoops) {
                await Utilities.sleep(1000);
                waitedLoops++;
            }

            // If for some reason the log file was not created, then we skip
            // streaming the log to console but still let the Unity process run.
            if (waitedLoops < maxLoops) {
                // Now we can start streaming it.
                UnityLogStreamer.startStreaming(logFilePath);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            } else {
                console.error(e);
            }
        }

        while (resultPending) {
            await Utilities.sleep(1000);
        }

        // Clean up and finish.
        UnityLogStreamer.stopStreaming();

        return execResult;
    }
}
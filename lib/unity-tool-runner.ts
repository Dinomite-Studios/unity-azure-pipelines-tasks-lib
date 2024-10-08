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
        const execResult = tool.exec();
        while (execResult.isPending() && !fs.existsSync(logFilePath)) {
            await Utilities.sleep(1000);
        }

        UnityLogStreamer.printOpen();
        const result = await UnityLogStreamer.stream(logFilePath, execResult);
        UnityLogStreamer.printClose();

        return result;
    }
}
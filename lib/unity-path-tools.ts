// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import { Utilities } from './utilities';
import { OS, UnityVersionInfo } from './models';
import path = require('path');

export class UnityPathTools {

    /**
     * Gets the path to the Unity Hub executable dependong on the build agent's operating system.
     * @returns 
     */
    public static getUnityHubPath(): string {
        const os = Utilities.getOS();

        switch (os) {
            case OS.Windows: return path.join('C:', 'Program Files', 'Unity Hub', 'Unity Hub.exe');
            case OS.MacOS: return path.join('/', 'Applications', 'Unity Hub.app', 'Contents', 'MacOS', 'Unity Hub');
            case OS.Linux: return path.join('~', 'Applications', 'Unity Hub.AppImage');
            default: throw new Error('Operating system not supported!');
        }
    }

    /**
     * Gets the path to the Unity editors folder depending on the process platform.
     * @param mode Path lookup mode: unityHub, environmentVariable or customUnityEditorsPath.
     * @param customPath Contains the custom path specified by the user, if custom path mode selected.
     */
    public static getUnityEditorsPath(mode: string, customPath: string | null | undefined = null): string {
        if (mode === 'default') {
            const os = Utilities.getOS();

            switch (os) {
                case OS.Windows: return path.join('C:', 'Program Files', 'Unity', 'Hub', 'Editor');
                case OS.MacOS: return path.join('/', 'Applications', 'Unity', 'Hub', 'Editor');
                case OS.Linux: return path.join('~', 'Unity', 'Hub', 'Editor');
                default: throw new Error('Operating system not supported!');
            }
        } else if (mode === 'environmentVariable') {
            const environmentVariablePath = process.env.UNITYHUB_EDITORS_FOLDER_LOCATION as string;
            if (!environmentVariablePath) {
                throw Error('Environment variable UNITYHUB_EDITORS_FOLDER_LOCATION does not exist on agent.');
            }

            return environmentVariablePath;
        } else if (mode === 'specify') {
            if (!customPath) {
                throw Error(`${customPath} is not a valid Unity editors folder path.`);
            }

            return customPath;
        } else {
            throw Error('Invalid path mode for editors folder lookup specified.');
        }
    }

    /**
     * Generates the full path to the Unity executable.
     * @param unityEditorsPath The path to the Unity editors folder on the agent.
     * @param unityVersion The Unity editor version to use.
     * 
     * @returns The full path to the Unity editor executable file.
     */
    public static getUnityExecutableFullPath(unityEditorsPath: string, unityVersion: UnityVersionInfo): string {
        const unityEditorDirectory = this.getUnityEditorDirectory(unityEditorsPath, unityVersion);

        const os = Utilities.getOS();
        switch (os) {
            case OS.Windows: return path.join(unityEditorDirectory, 'Unity.exe');
            case OS.MacOS: return path.join(unityEditorDirectory, 'Unity.app', 'Contents', 'MacOS', 'Unity');
            case OS.Linux: return path.join(unityEditorDirectory, 'Unity');
        }
    }

    /**
     * 
     * @param unityEditorsPath The path to the Unity editors folder on the agent.
     * @param unityVersion The Unity editor version to use.
     * 
     * @returns The full path to the folder containing the Unity instance executable.
     */
    public static getUnityEditorDirectory(unityEditorsPath: string, unityVersion: UnityVersionInfo): string {
        const os = Utilities.getOS();

        switch (os) {
            case OS.Windows: return path.join(unityEditorsPath, unityVersion.version, 'Editor');
            case OS.MacOS: return path.join(unityEditorsPath, unityVersion.version);
            case OS.Linux: return path.join(unityEditorsPath, unityVersion.version, 'Editor');
        }
    }
}

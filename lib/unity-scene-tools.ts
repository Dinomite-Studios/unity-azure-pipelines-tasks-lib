// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import fs from 'fs';

export class UnitySceneTools {

    private static readonly unityProjectSettingsFolder = 'ProjectSettings';
    private static readonly unityEditorBuildSettingsFile = 'EditorBuildSettings.asset';

    /**
     * Creates a new empty scene asset file at a given path.
     * 
     * @param projectPath The root path of the Unity project.
     * @param scenePath The path of the scene within the project, relative to the project path.
     * @param addToBuildSettings If set, the scene is also added to the editor build scenes list.
     */
    public static createSceneAt(projectPath: string, scenePath: string, addToBuildSettings: boolean): Error | null | undefined {
        try {
            const sceneFilePath = path.join(projectPath, scenePath);
            const sceneMetaFilePath = path.join(projectPath, `${scenePath}.meta`)
            const sceneGuid = crypto.randomUUID().replace(/-/g, '');

            tl.mkdirP(path.dirname(sceneFilePath));
            tl.writeFile(sceneFilePath, '');
            tl.writeFile(sceneMetaFilePath, `fileFormatVersion: 2\nguid: ${sceneGuid}`)

            if (addToBuildSettings) {
                UnitySceneTools.addSceneToBuildSettings(projectPath, true, scenePath, sceneGuid);
            }
        } catch (e) {
            if (e instanceof Error) {
                return e;
            }
        }
    }

    /**
     * Adds a scene configuration to a project's build scenes configuration list.
     * 
     * @param projectPath The root path of the Unity project.
     * @param sceneEnabled Should the scene be added as enabled?
     * @param scenePath The path of the scene within the project, relative to the project path.
     * @param sceneGuid The GUID of the scene asset.
     */
    public static addSceneToBuildSettings(projectPath: string, sceneEnabled: boolean, scenePath: string, sceneGuid: string): Error | null | undefined {
        try {
            const editorBuildSettingsFilePath = path.join(projectPath, UnitySceneTools.unityProjectSettingsFolder, UnitySceneTools.unityEditorBuildSettingsFile);
            const editorBuildSettingsFileContent = fs.readFileSync(editorBuildSettingsFilePath, { encoding: 'utf8' });

            const scenesRegex = /(m_Scenes:\s*\[\])/;
            const replacement = `m_Scenes:\n  - enabled: ${sceneEnabled ? 1 : 0}\n    path: ${scenePath}\n    guid: ${sceneGuid}`;
            const updatedContent = editorBuildSettingsFileContent.replace(scenesRegex, replacement);

            fs.writeFileSync(editorBuildSettingsFilePath, updatedContent, 'utf-8');
        } catch (e) {
            if (e instanceof Error) {
                return e;
            }
        }
    }
}
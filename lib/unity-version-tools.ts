import { UnityVersionInfo, UnityVersionInfoResult } from './models';
import path = require('path');
import fs = require('fs');

export class UnityVersionTools {

    private static readonly projectSettingsFolder = 'ProjectSettings';
    private static readonly projectVersionFile = 'ProjectVersion.txt';

    /**
     * Gets a Unity project's Unity editor version by looking up the project version file in the project directory.
     * @param projectRootPath Relative path to the Unity project's root folder containing the assets folder, starting from the current working directory.
     * @returns The project's used Unity editor version in case of success. Error message in case of failure.
     */
    public static determineProjectVersionFromFile(projectRootPath: string): UnityVersionInfoResult {
        try {
            const projectVersionFilePath = path.join(projectRootPath, UnityVersionTools.projectSettingsFolder, UnityVersionTools.projectVersionFile);
            const projectVersionFileContent = fs.readFileSync(projectVersionFilePath, { encoding: 'utf8' });
            const projectVersionResult = this.determineProjectVersionFromContent(projectVersionFileContent);

            return projectVersionResult;
        } catch (e) {
            let errorMessage = 'Unknown error while determining Unity project version.'

            if (e instanceof Error) {
                errorMessage = e.message;
            }

            return {
                error: errorMessage
            };
        }
    }

    /**
     * Gets a Unity project's Unity editor version using the content of a project version description file.
     * @param content The ProjectVersion.txt content to use for determining the project version.
     * @returns The project's used Unity editor version in case of success. Error message in case of failure.
     */
    public static determineProjectVersionFromContent(content: string): UnityVersionInfoResult {
        if (content && content !== '') {
            let version = '';
            let revision = '';
            let isAlpha = false;
            let isBeta = false;

            const lines = content.split('\n');
            lines.forEach(line => {
                const keyValue = line.split(':');
                if (keyValue[0] === 'm_EditorVersion') {
                    version = keyValue[1].trim();
                    isAlpha = version.includes('a');
                    isBeta = version.includes('b');
                } else if (keyValue[0] === 'm_EditorVersionWithRevision') {
                    const revisionRegex: RegExp = /.*\((.*)\)/;
                    const revisionRegexResult = revisionRegex.exec(keyValue[1]);
                    if (revisionRegexResult) {
                        revision = revisionRegexResult[1];
                    }
                }
            });

            if (revision) {
                return {
                    info: {
                        version: version,
                        revision: revision,
                        isAlpha: isAlpha,
                        isBeta: isBeta
                    }
                };
            }

            return {
                info: {
                    version: version,
                    isAlpha: isAlpha,
                    isBeta: isBeta
                }
            };
        }

        return {
            error: 'Unknown project version format encountered.'
        };
    }
}
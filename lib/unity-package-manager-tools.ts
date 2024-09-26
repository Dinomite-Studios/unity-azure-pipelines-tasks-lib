// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import path = require('path');
import fs from 'fs';

export class UnityPackageManagerTools {

    private static readonly packagesFolder = 'Packages';
    private static readonly packageManifestFile = 'manifest.json';

    /**
     * Adds a package to a project's package manifest.
     * 
     * @param projectPath The path to the project on disc.
     * @param packageName The package identifer.
     * @param versionOrGitUrl The package version to install (can also be a git URL in case the package is installed via git).
     */
    public static addPackageToProject(projectPath: string, packageName: string, versionOrGitUrl: string): Error | null | undefined {
        try {
            const packageManifestFilePath = path.join(projectPath, UnityPackageManagerTools.packagesFolder, UnityPackageManagerTools.packageManifestFile);
            const packageManifestFileContent = fs.readFileSync(packageManifestFilePath, { encoding: 'utf8' });
            let jsonData = JSON.parse(packageManifestFileContent);

            if (!jsonData.dependencies.hasOwnProperty(packageName)) {
                jsonData.dependencies[packageName] = versionOrGitUrl;
                const updatedData = JSON.stringify(jsonData);
                fs.writeFileSync(packageManifestFilePath, updatedData, 'utf-8');
            }
        } catch (e) {
            if (e instanceof Error) {
                return e;
            }
        }
    }

    /**
     * Removes a package from a project's package manifest.
     * 
     * @param projectPath The path to the project on disc.
     * @param packageName The package identifer.
     */
    public static removePackageFromProject(projectPath: string, packageName: string): Error | null | undefined {
        try {
            const packageManifestFilePath = path.join(projectPath, UnityPackageManagerTools.packagesFolder, UnityPackageManagerTools.packageManifestFile);
            const packageManifestFileContent = fs.readFileSync(packageManifestFilePath, { encoding: 'utf8' });
            let jsonData = JSON.parse(packageManifestFileContent);

            if (jsonData.dependencies.hasOwnProperty(packageName)) {
                delete jsonData.dependencies[packageName];
                const updatedData = JSON.stringify(jsonData);
                fs.writeFileSync(packageManifestFilePath, updatedData, 'utf-8');
            }
        } catch (e) {
            if (e instanceof Error) {
                return e;
            }
        }
    }
}
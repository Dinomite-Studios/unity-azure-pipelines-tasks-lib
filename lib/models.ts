// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

/**
 * Supported operating systems.
 */
export enum OS {
    Windows = 0,
    MacOS,
    Linux
};

/**
 * Information about a Unity engine version.
 */
export interface UnityVersionInfo {

    /**
     * Version identifier, e.g. 2019.3.5f1.
     */
    version: string;

    /**
     * Version revision if available, e.g. d691e07d38ef.
     */
    revision?: string;

    /**
     * Is this a beta version of Unity?
     */
    isBeta: boolean;

    /**
     * Is this an alpha version of Unity?
     */
    isAlpha: boolean;
};

/**
 * The result of an attempt to determine a project's last used Unity editor version.
 */
export interface UnityVersionInfoResult {

    /**
     * Information found about the project's last used Unity editor version.
     */
    info?: UnityVersionInfo;

    /**
     * Error information in case the version information could not be retrieved.
     */
    error?: string;
}
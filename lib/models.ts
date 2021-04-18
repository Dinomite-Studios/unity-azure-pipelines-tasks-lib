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

export interface UnityVersionInfoResult {
    info?: UnityVersionInfo;
    error?: string;
}
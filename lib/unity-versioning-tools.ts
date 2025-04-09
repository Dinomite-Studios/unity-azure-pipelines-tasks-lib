// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import semver from "semver";
import fs from "fs";
import path = require("path");
import { BuildNumbers, SemanticVersion } from "./models";
import tl = require("azure-pipelines-task-lib/task");

/**
 * A collection of static functions to manipulate the bundle versrion of a Unity project.
 */
export class UnityVersioningTools {
  private static readonly unityProjectSettingsFolder = "ProjectSettings";
  private static readonly unityProjectSettingsFile = "ProjectSettings.asset";

  static readonly buildNumberKey = "buildNumber:";
  static readonly buildNumberStandaloneKey = "Standalone:";
  static readonly buildNumberVisionOSKey = "VisionOS:";
  static readonly buildNumberiPhoneKey = "iPhone:";
  static readonly buildNumberTVOSKey = "tvOS:";

  static readonly bundleVersionKey = "bundleVersion:";
  static readonly tvOSBundleVersionKey = "tvOSBundleVersion:";
  static readonly visionOSBundleVersionKey = "visionOSBundleVersion:";
  static readonly androidBundleVersionCodeKey = "AndroidBundleVersionCode:";

  /**
   * Increments the build number for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param increments The increments for each platform.
   * @returns The updated build numbers.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static incrementBuildNumber(
    projectPath: string,
    increments: Partial<BuildNumbers>
  ): BuildNumbers {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the buildNumber section.
      const buildNumberStartIndex = this.findLineIndex(
        lines,
        this.buildNumberKey,
        true
      );

      // Find the end of the buildNumber section.
      let buildNumberEndIndex = buildNumberStartIndex;
      for (let i = buildNumberStartIndex + 1; i < lines.length; i++) {
        var line = lines[i].trim();
        if (
          !line.startsWith(this.buildNumberStandaloneKey) &&
          !line.startsWith(this.buildNumberVisionOSKey) &&
          !line.startsWith(this.buildNumberiPhoneKey) &&
          !line.startsWith(this.buildNumberTVOSKey)
        ) {
          buildNumberEndIndex = i;
          break;
        }
      }

      if (buildNumberEndIndex === buildNumberStartIndex) {
        throw new Error(
          `${this.buildNumberKey} section end not found in the file.`
        );
      }

      // Extract the build numbers.
      const buildNumbers: BuildNumbers = {
        Standalone: 0,
        VisionOS: 0,
        iPhone: 0,
        tvOS: 0,
      };

      // Parse each build number line.
      for (let i = buildNumberStartIndex + 1; i < buildNumberEndIndex; i++) {
        const line = lines[i].trim();

        // Parse each build number entry.
        if (line.includes(this.buildNumberStandaloneKey)) {
          buildNumbers.Standalone = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes(this.buildNumberVisionOSKey)) {
          buildNumbers.VisionOS = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes(this.buildNumberiPhoneKey)) {
          buildNumbers.iPhone = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes(this.buildNumberTVOSKey)) {
          buildNumbers.tvOS = parseInt(line.split(":")[1].trim(), 10);
        }
      }

      // Apply the increments.
      if (increments.Standalone) {
        buildNumbers.Standalone += increments.Standalone;
      }
      if (increments.VisionOS) {
        buildNumbers.VisionOS += increments.VisionOS;
      }
      if (increments.iPhone) {
        buildNumbers.iPhone += increments.iPhone;
      }
      if (increments.tvOS) {
        buildNumbers.tvOS += increments.tvOS;
      }

      // Reconstruct the buildNumber section.
      const newBuildNumberSection = [
        `  ${this.buildNumberKey}`,
        `    ${this.buildNumberStandaloneKey} ${buildNumbers.Standalone}`,
        `    ${this.buildNumberVisionOSKey} ${buildNumbers.VisionOS}`,
        `    ${this.buildNumberiPhoneKey} ${buildNumbers.iPhone}`,
        `    ${this.buildNumberTVOSKey} ${buildNumbers.tvOS}`,
      ].join("\n");

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, buildNumberStartIndex),
        newBuildNumberSection,
        ...lines.slice(buildNumberEndIndex),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return buildNumbers;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error incrementing build number: " + error.message);
      } else {
        throw new Error("Error incrementing build number: Unknown error");
      }
    }
  }

  /**
   * Sets the build number for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param values The new build number for each platform.
   * @returns The updated build numbers.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static setBuildNumber(
    projectPath: string,
    values: Partial<BuildNumbers>
  ): BuildNumbers {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the buildNumber section.
      const buildNumberStartIndex = this.findLineIndex(
        lines,
        this.buildNumberKey,
        true
      );

      // Find the end of the buildNumber section.
      let buildNumberEndIndex = buildNumberStartIndex;
      for (let i = buildNumberStartIndex + 1; i < lines.length; i++) {
        var line = lines[i].trim();
        if (
          !line.startsWith(this.buildNumberStandaloneKey) &&
          !line.startsWith(this.buildNumberVisionOSKey) &&
          !line.startsWith(this.buildNumberiPhoneKey) &&
          !line.startsWith(this.buildNumberTVOSKey)
        ) {
          buildNumberEndIndex = i;
          break;
        }
      }

      if (buildNumberEndIndex === buildNumberStartIndex) {
        throw new Error(
          `${this.buildNumberKey} section end not found in the file.`
        );
      }

      // Extract the build numbers.
      const buildNumbers: BuildNumbers = {
        Standalone: 0,
        VisionOS: 0,
        iPhone: 0,
        tvOS: 0,
      };

      // Parse each build number line.
      for (let i = buildNumberStartIndex + 1; i < buildNumberEndIndex; i++) {
        const line = lines[i].trim();

        // Parse each build number entry.
        if (line.includes(this.buildNumberStandaloneKey)) {
          buildNumbers.Standalone = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes(this.buildNumberVisionOSKey)) {
          buildNumbers.VisionOS = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes(this.buildNumberiPhoneKey)) {
          buildNumbers.iPhone = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes(this.buildNumberTVOSKey)) {
          buildNumbers.tvOS = parseInt(line.split(":")[1].trim(), 10);
        }
      }

      // Apply the new values.
      if (values.Standalone) {
        buildNumbers.Standalone = values.Standalone;
      }
      if (values.VisionOS) {
        buildNumbers.VisionOS = values.VisionOS;
      }
      if (values.iPhone) {
        buildNumbers.iPhone = values.iPhone;
      }
      if (values.tvOS) {
        buildNumbers.tvOS = values.tvOS;
      }

      // Reconstruct the buildNumber section.
      const newBuildNumberSection = [
        `  ${this.buildNumberKey}`,
        `    ${this.buildNumberStandaloneKey} ${buildNumbers.Standalone}`,
        `    ${this.buildNumberVisionOSKey} ${buildNumbers.VisionOS}`,
        `    ${this.buildNumberiPhoneKey} ${buildNumbers.iPhone}`,
        `    ${this.buildNumberTVOSKey} ${buildNumbers.tvOS}`,
      ].join("\n");

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, buildNumberStartIndex),
        newBuildNumberSection,
        ...lines.slice(buildNumberEndIndex),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return buildNumbers;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error setting build number: " + error.message);
      } else {
        throw new Error("Error setting build number: Unknown error");
      }
    }
  }

  /**
   * Increments the Android bundle version code for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param increment The increment for the bundle version code.
   * @returns The updated bundle version code.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static incrementAndroidBundleVersionCode(
    projectPath: string,
    increment: number
  ): number {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the AndroidBundleVersionCode section.
      const androidBundleVersionCodeIndex = this.findLineIndex(
        lines,
        this.androidBundleVersionCodeKey
      );

      // Extract the Android bundle version code.
      let androidBundleVersionCode = parseInt(
        lines[androidBundleVersionCodeIndex].split(":")[1].trim(),
        10
      );

      // Apply the increment.
      androidBundleVersionCode += increment;

      // Reconstruct the Android bundle version code line.
      const newAndroidBundleVersionCodeLine = `  ${this.androidBundleVersionCodeKey} ${androidBundleVersionCode}`;

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, androidBundleVersionCodeIndex),
        newAndroidBundleVersionCodeLine,
        ...lines.slice(androidBundleVersionCodeIndex + 1),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return androidBundleVersionCode;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Error incrementing android bundle version code: " + error.message
        );
      } else {
        throw new Error(
          "Error incrementing android bundle version code: Unknown error"
        );
      }
    }
  }

  /**
   * Sets the Android bundle version code for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param value The new bundle version code.
   * @returns The updated bundle version code.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static setAndroidBundleVersionCode(
    projectPath: string,
    value: number
  ): number {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the AndroidBundleVersionCode section.
      const androidBundleVersionCodeIndex = this.findLineIndex(
        lines,
        this.androidBundleVersionCodeKey
      );

      // Extract the Android bundle version code.
      let androidBundleVersionCode = parseInt(
        lines[androidBundleVersionCodeIndex].split(":")[1].trim(),
        10
      );

      // Apply the new value.
      androidBundleVersionCode = value;

      // Reconstruct the Android bundle version code line.
      const newAndroidBundleVersionCodeLine = `  ${this.androidBundleVersionCodeKey} ${androidBundleVersionCode}`;

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, androidBundleVersionCodeIndex),
        newAndroidBundleVersionCodeLine,
        ...lines.slice(androidBundleVersionCodeIndex + 1),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return androidBundleVersionCode;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Error setting android bundle version code: " + error.message
        );
      } else {
        throw new Error(
          "Error setting android bundle version code: Unknown error"
        );
      }
    }
  }

  /**
   * Increments the bundle version for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param increments The increments for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static incrementBundleVersion(
    projectPath: string,
    increments: Partial<SemanticVersion>
  ): SemanticVersion {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the bundleVersion section.
      const bundleVersionIndex = this.findLineIndex(
        lines,
        this.bundleVersionKey
      );

      // Extract the bundle version.
      let bundleVersion = semver.parse(
        lines[bundleVersionIndex].split(":")[1].trim()
      );
      if (!bundleVersion) {
        throw new Error(
          "Invalid bundle version format. Expected format is x.y.z."
        );
      }

      // Apply the increment.
      if (increments.major) {
        bundleVersion.major += increments.major;
      }
      if (increments.minor) {
        bundleVersion.minor += increments.minor;
      }
      if (increments.patch) {
        bundleVersion.patch += increments.patch;
      }

      // Reconstruct the Android bundle version code line.
      const newBundleVersionLine = `  ${this.bundleVersionKey} ${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, bundleVersionIndex),
        newBundleVersionLine,
        ...lines.slice(bundleVersionIndex + 1),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return {
        major: bundleVersion.major,
        minor: bundleVersion.minor,
        patch: bundleVersion.patch,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error incrementing bundle version: " + error.message);
      } else {
        throw new Error("Error incrementing bundle version: Unknown error");
      }
    }
  }

  /**
   * Sets the bundle version for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param value The new value for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static setBundleVersion(
    projectPath: string,
    value: Partial<SemanticVersion>
  ): SemanticVersion {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the bundleVersion section.
      const bundleVersionIndex = this.findLineIndex(
        lines,
        this.bundleVersionKey
      );

      // Extract the bundle version.
      let bundleVersion = semver.parse(
        lines[bundleVersionIndex].split(":")[1].trim()
      );
      if (!bundleVersion) {
        throw new Error(
          "Invalid bundle version format. Expected format is x.y.z."
        );
      }

      // Apply the new value.
      if (value.major) {
        bundleVersion.major = value.major;
      }
      if (value.minor) {
        bundleVersion.minor = value.minor;
      }
      if (value.patch) {
        bundleVersion.patch = value.patch;
      }

      // Reconstruct the Android bundle version code line.
      const newBundleVersionLine = `  ${this.bundleVersionKey} ${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, bundleVersionIndex),
        newBundleVersionLine,
        ...lines.slice(bundleVersionIndex + 1),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return {
        major: bundleVersion.major,
        minor: bundleVersion.minor,
        patch: bundleVersion.patch,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error setting bundle version: " + error.message);
      } else {
        throw new Error("Error setting bundle version: Unknown error");
      }
    }
  }

  /**
   * Increments the tvOS bundle version for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param increment The increment for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static incrementTvOSBundleVersion(
    projectPath: string,
    increments: Partial<SemanticVersion>
  ): SemanticVersion {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the bundleVersion section.
      const bundleVersionIndex = this.findLineIndex(
        lines,
        this.tvOSBundleVersionKey
      );

      // Extract the bundle version.
      let bundleVersion = semver.parse(
        lines[bundleVersionIndex].split(":")[1].trim()
      );
      if (!bundleVersion) {
        throw new Error(
          "Invalid bundle version format. Expected format is x.y.z."
        );
      }

      // Apply the increment.
      if (increments.major) {
        bundleVersion.major += increments.major;
      }
      if (increments.minor) {
        bundleVersion.minor += increments.minor;
      }
      if (increments.patch) {
        bundleVersion.patch += increments.patch;
      }

      // Reconstruct the Android bundle version code line.
      const newTvOSBundleVersionLine = `  ${this.tvOSBundleVersionKey} ${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, bundleVersionIndex),
        newTvOSBundleVersionLine,
        ...lines.slice(bundleVersionIndex + 1),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return {
        major: bundleVersion.major,
        minor: bundleVersion.minor,
        patch: bundleVersion.patch,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Error incrementing tvOS bundle version: " + error.message
        );
      } else {
        throw new Error(
          "Error incrementing tvOS bundle version: Unknown error"
        );
      }
    }
  }

  /**
   * Sets the tvOS bundle version for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param increment The new value for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static setTvOSBundleVersion(
    projectPath: string,
    value: Partial<SemanticVersion>
  ): SemanticVersion {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the bundleVersion section.
      const bundleVersionIndex = this.findLineIndex(
        lines,
        this.tvOSBundleVersionKey
      );

      // Extract the bundle version.
      let bundleVersion = semver.parse(
        lines[bundleVersionIndex].split(":")[1].trim()
      );
      if (!bundleVersion) {
        throw new Error(
          "Invalid bundle version format. Expected format is x.y.z."
        );
      }

      // Apply the new value.
      if (value.major) {
        bundleVersion.major = value.major;
      }
      if (value.minor) {
        bundleVersion.minor = value.minor;
      }
      if (value.patch) {
        bundleVersion.patch = value.patch;
      }

      // Reconstruct the Android bundle version code line.
      const newTvOSBundleVersionLine = `  ${this.tvOSBundleVersionKey} ${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, bundleVersionIndex),
        newTvOSBundleVersionLine,
        ...lines.slice(bundleVersionIndex + 1),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return {
        major: bundleVersion.major,
        minor: bundleVersion.minor,
        patch: bundleVersion.patch,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error setting tvOS bundle version: " + error.message);
      } else {
        throw new Error("Error setting tvOS bundle version: Unknown error");
      }
    }
  }

  /**
   * Increments the VisionOS bundle version for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param increment The increment for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static incrementVisionOSBundleVersion(
    projectPath: string,
    increments: Partial<SemanticVersion>
  ): SemanticVersion {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the bundleVersion section.
      const bundleVersionIndex = this.findLineIndex(
        lines,
        this.visionOSBundleVersionKey
      );

      // Extract the bundle version.
      let bundleVersion = semver.parse(
        lines[bundleVersionIndex].split(":")[1].trim()
      );
      if (!bundleVersion) {
        throw new Error(
          "Invalid bundle version format. Expected format is x.y.z."
        );
      }

      // Apply the increment.
      if (increments.major) {
        bundleVersion.major += increments.major;
      }
      if (increments.minor) {
        bundleVersion.minor += increments.minor;
      }
      if (increments.patch) {
        bundleVersion.patch += increments.patch;
      }

      // Reconstruct the Android bundle version code line.
      const newVisionOSBundleVersionLine = `  ${this.visionOSBundleVersionKey} ${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, bundleVersionIndex),
        newVisionOSBundleVersionLine,
        ...lines.slice(bundleVersionIndex + 1),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return {
        major: bundleVersion.major,
        minor: bundleVersion.minor,
        patch: bundleVersion.patch,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Error incrementing VisionOS bundle version: " + error.message
        );
      } else {
        throw new Error(
          "Error incrementing VisionOS bundle version: Unknown error"
        );
      }
    }
  }

  /**
   * Sets the VisionOS bundle version for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param value The new value for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static setVisionOSBundleVersion(
    projectPath: string,
    value: Partial<SemanticVersion>
  ): SemanticVersion {
    try {
      // Read file into individual lines.
      const lines = this.readLines(projectPath);

      // Find the bundleVersion section.
      const bundleVersionIndex = this.findLineIndex(
        lines,
        this.visionOSBundleVersionKey
      );

      // Extract the bundle version.
      let bundleVersion = semver.parse(
        lines[bundleVersionIndex].split(":")[1].trim()
      );
      if (!bundleVersion) {
        throw new Error(
          "Invalid bundle version format. Expected format is x.y.z."
        );
      }

      // Apply the new value.
      if (value.major) {
        bundleVersion.major = value.major;
      }
      if (value.minor) {
        bundleVersion.minor = value.minor;
      }
      if (value.patch) {
        bundleVersion.patch = value.patch;
      }

      // Reconstruct the Android bundle version code line.
      const newVisionOSBundleVersionLine = `  ${this.visionOSBundleVersionKey} ${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;

      // Replace the old section with the new one.
      const newLines = [
        ...lines.slice(0, bundleVersionIndex),
        newVisionOSBundleVersionLine,
        ...lines.slice(bundleVersionIndex + 1),
      ];

      // Write the updated content back to the file.
      this.writeLines(projectPath, newLines);

      return {
        major: bundleVersion.major,
        minor: bundleVersion.minor,
        patch: bundleVersion.patch,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Error setting VisionOS bundle version: " + error.message
        );
      } else {
        throw new Error("Error setting VisionOS bundle version: Unknown error");
      }
    }
  }

  private static readLines(projectPath: string): string[] {
    const projectSettingsFilePath = path.join(
      projectPath,
      this.unityProjectSettingsFolder,
      this.unityProjectSettingsFile
    );
    const projectSettingsFileContent = fs.readFileSync(
      projectSettingsFilePath,
      { encoding: "utf8" }
    );

    return projectSettingsFileContent.split("\n");
  }

  private static writeLines(projectPath: string, lines: string[]) {
    const projectSettingsFilePath = path.join(
      projectPath,
      this.unityProjectSettingsFolder,
      this.unityProjectSettingsFile
    );
    const projectSettingsFileContent = fs.readFileSync(
      projectSettingsFilePath,
      { encoding: "utf8" }
    );

    tl.writeFile(projectSettingsFilePath, lines.join("\n"), {
      encoding: "utf8",
    });
  }

  private static findLineIndex(
    lines: string[],
    key: string,
    strictEqual: boolean = false
  ): number {
    let index = -1;

    if (strictEqual) {
      index = lines.findIndex((line) => line.trim() === key);
    } else {
      index = lines.findIndex((line) => line.trim().startsWith(key));
    }

    if (index === -1) {
      throw new Error(`${key} line not found in the file.`);
    }

    return index;
  }
}

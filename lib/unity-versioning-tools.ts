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
   * Updates the build number for a Unity project either by incrementing it or setting a value directly.
   * @param projectPath The path to the Unity project.
   * @param increment Whether to increment current values instead of setting a value.
   * @param values The update values for the build number.
   * @returns The updated build numbers.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static updateBuildNumber(
    projectPath: string,
    increment: boolean,
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

      // Apply the increments.
      if (values.Standalone) {
        buildNumbers.Standalone = increment
          ? buildNumbers.Standalone + values.Standalone
          : values.Standalone;
      }
      if (values.VisionOS) {
        buildNumbers.VisionOS = increment
          ? buildNumbers.VisionOS + values.VisionOS
          : values.VisionOS;
      }
      if (values.iPhone) {
        buildNumbers.iPhone = increment
          ? buildNumbers.iPhone + values.iPhone
          : values.iPhone;
      }
      if (values.tvOS) {
        buildNumbers.tvOS = increment
          ? buildNumbers.tvOS + values.tvOS
          : values.tvOS;
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
        throw new Error("Error updating build number: " + error.message);
      } else {
        throw new Error("Error updating build number: Unknown error");
      }
    }
  }

  /**
   * Updates the Android bundle version code for a Unity project either by incrementing it or setting a value directly.
   * @param projectPath The path to the Unity project.
   * @param increment Whether to increment current values instead of setting a value.
   * @param value The update value for the bundle version code.
   * @returns The updated bundle version code.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static updateAndroidBundleVersionCode(
    projectPath: string,
    increment: boolean,
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

      // Apply the update.
      androidBundleVersionCode = increment
        ? androidBundleVersionCode + value
        : value;

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
          "Error updating android bundle version code: " + error.message
        );
      } else {
        throw new Error(
          "Error updating android bundle version code: Unknown error"
        );
      }
    }
  }

  /**
   * Updates the bundle version for a Unity project either by incrementing it or setting a value directly.
   * @param projectPath The path to the Unity project.
   * @param increment Whether to increment current values instead of setting a value.
   * @param values The update values for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static updateBundleVersion(
    projectPath: string,
    increment: boolean,
    values: Partial<SemanticVersion>
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

      // Apply the update.
      if (values.major) {
        bundleVersion.major = increment
          ? bundleVersion.major + values.major
          : values.major;
      }
      if (values.minor) {
        bundleVersion.minor = increment
          ? bundleVersion.minor + values.minor
          : values.minor;
      }
      if (values.patch) {
        bundleVersion.patch = increment
          ? bundleVersion.patch + values.patch
          : values.patch;
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
        throw new Error("Error updating bundle version: " + error.message);
      } else {
        throw new Error("Error updating bundle version: Unknown error");
      }
    }
  }

  /**
   * Increments the tvOS bundle version for a Unity project either by incrementing it or setting a value directly.
   * @param projectPath The path to the Unity project.
   * @param increment Whether to increment current values instead of setting a value.
   * @param values The update values for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static updateTvOSBundleVersion(
    projectPath: string,
    increment: boolean,
    values: Partial<SemanticVersion>
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

      // Apply the update.
      if (values.major) {
        bundleVersion.major = increment
          ? bundleVersion.major + values.major
          : values.major;
      }
      if (values.minor) {
        bundleVersion.minor = increment
          ? bundleVersion.minor + values.minor
          : values.minor;
      }
      if (values.patch) {
        bundleVersion.patch = increment
          ? bundleVersion.patch + values.patch
          : values.patch;
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
        throw new Error("Error updating tvOS bundle version: " + error.message);
      } else {
        throw new Error("Error updating tvOS bundle version: Unknown error");
      }
    }
  }

  /**
   * Updates the VisionOS bundle version for a Unity project either by incrementing it or setting a value directly.
   * @param projectPath The path to the Unity project.
   * @param increment Whether to increment current values instead of setting a value.
   * @param values The update values for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static updateVisionOSBundleVersion(
    projectPath: string,
    increment: boolean,
    values: Partial<SemanticVersion>
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

      // Apply the update.
      if (values.major) {
        bundleVersion.major = increment
          ? bundleVersion.major + values.major
          : values.major;
      }
      if (values.minor) {
        bundleVersion.minor = increment
          ? bundleVersion.minor + values.minor
          : values.minor;
      }
      if (values.patch) {
        bundleVersion.patch = increment
          ? bundleVersion.patch + values.patch
          : values.patch;
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
          "Error updating VisionOS bundle version: " + error.message
        );
      } else {
        throw new Error(
          "Error updating VisionOS bundle version: Unknown error"
        );
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

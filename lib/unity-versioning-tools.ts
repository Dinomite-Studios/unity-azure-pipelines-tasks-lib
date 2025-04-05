// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import semver from "semver";
import fs from "fs";
import path = require("path");
import { BuildNumbers } from "./models";
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
      const projectSettingsFilePath = path.join(
        projectPath,
        this.unityProjectSettingsFolder,
        this.unityProjectSettingsFile
      );
      const projectSettingsFileContent = fs.readFileSync(
        projectSettingsFilePath,
        { encoding: "utf8" }
      );

      // Split the file into lines.
      const lines = projectSettingsFileContent.split("\n");

      // Find the buildNumber section.
      const buildNumberStartIndex = lines.findIndex(
        (line) => line.trim() === this.buildNumberKey
      );

      if (buildNumberStartIndex === -1) {
        throw new Error(`${this.buildNumberKey} line not found in the file.`);
      }

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
      tl.writeFile(projectSettingsFilePath, newLines.join("\n"), {
        encoding: "utf8",
      });

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
   * Increments the Android bundle version code for a Unity project.
   * @param projectPath The path to the Unity project.
   * @param increment The increment for the bundle version.
   * @returns The updated bundle version.
   * @throws Will throw an error if the file cannot be read or written.
   */
  public static incrementAndroidBundleVersionCode(
    projectPath: string,
    increment: number
  ): number {
    try {
      const projectSettingsFilePath = path.join(
        projectPath,
        this.unityProjectSettingsFolder,
        this.unityProjectSettingsFile
      );
      const projectSettingsFileContent = fs.readFileSync(
        projectSettingsFilePath,
        { encoding: "utf8" }
      );

      // Split the file into lines.
      const lines = projectSettingsFileContent.split("\n");

      // Find the AndroidBundleVersionCode section.
      const androidBundleVersionCodeIndex = lines.findIndex((line) =>
        line.trim().startsWith(this.androidBundleVersionCodeKey)
      );

      if (androidBundleVersionCodeIndex === -1) {
        throw new Error(
          `${this.androidBundleVersionCodeKey} line not found in the file.`
        );
      }

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
      tl.writeFile(projectSettingsFilePath, newLines.join("\n"), {
        encoding: "utf8",
      });

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
}

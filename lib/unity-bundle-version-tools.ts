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
export class UnityBundleVersionTools {
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

      // Split the file into lines
      const lines = projectSettingsFileContent.split("\n");

      // Find the buildNumber section
      const buildNumberStartIndex = lines.findIndex((line) =>
        line.trim().startsWith("buildNumber:")
      );
      if (buildNumberStartIndex === -1) {
        throw new Error("buildNumber section not found in the file");
      }

      // Analyze the indentation pattern
      const buildNumberLine = lines[buildNumberStartIndex];
      const baseIndentation = buildNumberLine.match(/^\s*/)?.[0] || "";
      const childIndentation = baseIndentation + "    "; // Typically 4 spaces more than parent

      // Extract current build numbers
      const buildNumbers: BuildNumbers = {
        Standalone: 0,
        VisionOS: 0,
        iPhone: 0,
        tvOS: 0,
      };

      // Parse each build number line while tracking the exact indentation used
      const originalLines: { key: string; line: string }[] = [];
      for (let i = buildNumberStartIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();

        // Stop when we reach a line that's not indented (end of buildNumber section)
        if (line === "" || !lines[i].startsWith(childIndentation)) {
          break;
        }

        // Store the original line exactly as it was (for indentation preservation)
        originalLines.push({ line: lines[i], key: line.split(":")[0].trim() });

        // Parse values
        if (line.includes("Standalone:")) {
          buildNumbers.Standalone = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes("VisionOS:")) {
          buildNumbers.VisionOS = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes("iPhone:")) {
          buildNumbers.iPhone = parseInt(line.split(":")[1].trim(), 10);
        } else if (line.includes("tvOS:")) {
          buildNumbers.tvOS = parseInt(line.split(":")[1].trim(), 10);
        }
      }

      // Apply increments
      if (increments.Standalone !== undefined)
        buildNumbers.Standalone += increments.Standalone;
      if (increments.VisionOS !== undefined)
        buildNumbers.VisionOS += increments.VisionOS;
      if (increments.iPhone !== undefined)
        buildNumbers.iPhone += increments.iPhone;
      if (increments.tvOS !== undefined) buildNumbers.tvOS += increments.tvOS;

      // Reconstruct the buildNumber section using original indentation
      const newLines = [buildNumberLine];

      // For each original line, replace the value while keeping the exact same formatting
      for (const original of originalLines) {
        let newLine = original.line;

        if (original.key === "Standalone") {
          newLine = original.line.replace(
            /:.*$/,
            `: ${buildNumbers.Standalone}`
          );
        } else if (original.key === "VisionOS") {
          newLine = original.line.replace(/:.*$/, `: ${buildNumbers.VisionOS}`);
        } else if (original.key === "iPhone") {
          newLine = original.line.replace(/:.*$/, `: ${buildNumbers.iPhone}`);
        } else if (original.key === "tvOS") {
          newLine = original.line.replace(/:.*$/, `: ${buildNumbers.tvOS}`);
        }

        newLines.push(newLine);
      }

      // Find the end of the original buildNumber section
      let buildNumberEndIndex =
        buildNumberStartIndex + 1 + originalLines.length;

      // Replace the section while preserving all other content exactly
      const updatedProjectSettingsFileContent = [
        ...lines.slice(0, buildNumberStartIndex),
        ...newLines,
        ...lines.slice(buildNumberEndIndex),
      ].join("\n");

      // Write the updated content back to the file
      tl.writeFile(projectSettingsFilePath, updatedProjectSettingsFileContent);

      return buildNumbers;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error incrementing build number: " + error.message);
      } else {
        throw new Error("Error incrementing build number: Unknown error");
      }
    }
  }
}

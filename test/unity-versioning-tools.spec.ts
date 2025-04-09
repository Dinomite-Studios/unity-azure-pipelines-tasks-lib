// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import "mocha";
import { expect } from "chai";
import { UnityVersioningTools } from "../dist";

describe("UnityVersioningTools", () => {
  /*####################################################################################
  # Increment build number tests
  ####################################################################################*/

  it("Increment standalone build number by 1", () => {
    const result = UnityVersioningTools.incrementBuildNumber(__dirname, {
      Standalone: 1,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(0);
    expect(result.iPhone).to.equal(0);
    expect(result.tvOS).to.equal(0);
  });

  it("Increment VisionOS build number by 2", () => {
    const result = UnityVersioningTools.incrementBuildNumber(__dirname, {
      VisionOS: 2,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(2);
    expect(result.iPhone).to.equal(0);
    expect(result.tvOS).to.equal(0);
  });

  it("Increment iPhone build number by 3", () => {
    const result = UnityVersioningTools.incrementBuildNumber(__dirname, {
      iPhone: 3,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(2);
    expect(result.iPhone).to.equal(3);
    expect(result.tvOS).to.equal(0);
  });

  it("Increment tvOS build number by 4", () => {
    const result = UnityVersioningTools.incrementBuildNumber(__dirname, {
      tvOS: 4,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(2);
    expect(result.iPhone).to.equal(3);
    expect(result.tvOS).to.equal(4);
  });

  it("Leave build numbers unchanged", () => {
    const result = UnityVersioningTools.incrementBuildNumber(__dirname, {});
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(2);
    expect(result.iPhone).to.equal(3);
    expect(result.tvOS).to.equal(4);
  });

  it("Increment all build numbers by 1", () => {
    const result = UnityVersioningTools.incrementBuildNumber(__dirname, {
      Standalone: 1,
      VisionOS: 1,
      iPhone: 1,
      tvOS: 1,
    });
    expect(result.Standalone).to.equal(2);
    expect(result.VisionOS).to.equal(3);
    expect(result.iPhone).to.equal(4);
    expect(result.tvOS).to.equal(5);
  });

  /*####################################################################################
  # Set build number tests
  ####################################################################################*/

  it("Set standalone build number to 20", () => {
    const result = UnityVersioningTools.setBuildNumber(__dirname, {
      Standalone: 20,
    });
    expect(result.Standalone).to.equal(20);
  });

  it("Set VisionOS build number to 20", () => {
    const result = UnityVersioningTools.setBuildNumber(__dirname, {
      VisionOS: 20,
    });
    expect(result.Standalone).to.equal(20);
    expect(result.VisionOS).to.equal(20);
  });

  it("Set iPhone build number to 20", () => {
    const result = UnityVersioningTools.setBuildNumber(__dirname, {
      iPhone: 20,
    });
    expect(result.Standalone).to.equal(20);
    expect(result.VisionOS).to.equal(20);
    expect(result.iPhone).to.equal(20);
  });

  it("Set tvOS build number to 20", () => {
    const result = UnityVersioningTools.setBuildNumber(__dirname, {
      tvOS: 20,
    });
    expect(result.Standalone).to.equal(20);
    expect(result.VisionOS).to.equal(20);
    expect(result.iPhone).to.equal(20);
    expect(result.tvOS).to.equal(20);
  });

  it("Leave build numbers unchanged", () => {
    const result = UnityVersioningTools.setBuildNumber(__dirname, {});
    expect(result.Standalone).to.equal(20);
    expect(result.VisionOS).to.equal(20);
    expect(result.iPhone).to.equal(20);
    expect(result.tvOS).to.equal(20);
  });

  it("Set all build numbers to 1", () => {
    const result = UnityVersioningTools.setBuildNumber(__dirname, {
      Standalone: 1,
      VisionOS: 1,
      iPhone: 1,
      tvOS: 1,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(1);
    expect(result.iPhone).to.equal(1);
    expect(result.tvOS).to.equal(1);
  });

  /*####################################################################################
  # Increment Android bundle version code tests
  ####################################################################################*/

  it("Increment Android bundle version code by 1", () => {
    const result = UnityVersioningTools.incrementAndroidBundleVersionCode(
      __dirname,
      1
    );
    expect(result).to.equal(2);
  });

  it("Leave Android bundle version code unchanged", () => {
    const result = UnityVersioningTools.incrementAndroidBundleVersionCode(
      __dirname,
      0
    );
    expect(result).to.equal(2);
  });

  /*####################################################################################
  # Set Android bundle version code tests
  ####################################################################################*/

  it("Set Android bundle version code to 20", () => {
    const result = UnityVersioningTools.setAndroidBundleVersionCode(
      __dirname,
      20
    );
    expect(result).to.equal(20);
  });

  /*####################################################################################
  # Increment bundle version tests
  ####################################################################################*/

  it("Increment bundle version major by 1", () => {
    const result = UnityVersioningTools.incrementBundleVersion(__dirname, {
      major: 1,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(0);
    expect(result.patch).to.equal(0);
  });

  it("Increment bundle version minor by 2", () => {
    const result = UnityVersioningTools.incrementBundleVersion(__dirname, {
      minor: 2,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(0);
  });

  it("Increment bundle version patch by 3", () => {
    const result = UnityVersioningTools.incrementBundleVersion(__dirname, {
      patch: 3,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  it("Leave bundle version unchanged", () => {
    const result = UnityVersioningTools.incrementBundleVersion(__dirname, {});
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  /*####################################################################################
  # Set bundle version tests
  ####################################################################################*/

  it("Set bundle version major to 1", () => {
    const result = UnityVersioningTools.setBundleVersion(__dirname, {
      major: 1,
    });
    expect(result.major).to.equal(1);
  });

  it("Set bundle version minor to 1", () => {
    const result = UnityVersioningTools.setBundleVersion(__dirname, {
      minor: 1,
    });
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
  });

  it("Set bundle version patch to 1", () => {
    const result = UnityVersioningTools.setBundleVersion(__dirname, {
      patch: 1,
    });
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  it("Leave bundle version unchanged", () => {
    const result = UnityVersioningTools.setBundleVersion(__dirname, {});
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  /*####################################################################################
  # Increment tvOS bundle version tests
  ####################################################################################*/

  it("Increment tvOS bundle version major by 1", () => {
    const result = UnityVersioningTools.incrementTvOSBundleVersion(__dirname, {
      major: 1,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(0);
    expect(result.patch).to.equal(0);
  });

  it("Increment tvOS bundle version minor by 2", () => {
    const result = UnityVersioningTools.incrementTvOSBundleVersion(__dirname, {
      minor: 2,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(0);
  });

  it("Increment tvOS bundle version patch by 3", () => {
    const result = UnityVersioningTools.incrementTvOSBundleVersion(__dirname, {
      patch: 3,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  it("Leave tvOS bundle version unchanged", () => {
    const result = UnityVersioningTools.incrementTvOSBundleVersion(
      __dirname,
      {}
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  /*####################################################################################
  # Set tvOS bundle version tests
  ####################################################################################*/

  it("Set tvOS bundle version major to 1", () => {
    const result = UnityVersioningTools.setTvOSBundleVersion(__dirname, {
      major: 1,
    });
    expect(result.major).to.equal(1);
  });

  it("Set tvOS bundle version minor to 1", () => {
    const result = UnityVersioningTools.setTvOSBundleVersion(__dirname, {
      minor: 1,
    });
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
  });

  it("Set tvOS bundle version patch to 1", () => {
    const result = UnityVersioningTools.setTvOSBundleVersion(__dirname, {
      patch: 1,
    });
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  it("Leave tvOS bundle version unchanged", () => {
    const result = UnityVersioningTools.setTvOSBundleVersion(__dirname, {});
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  /*####################################################################################
  # Increment VisionOS bundle version tests
  ####################################################################################*/

  it("Increment VisionOS bundle version major by 1", () => {
    const result = UnityVersioningTools.incrementVisionOSBundleVersion(
      __dirname,
      {
        major: 1,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(0);
    expect(result.patch).to.equal(0);
  });

  it("Increment VisionOS bundle version minor by 2", () => {
    const result = UnityVersioningTools.incrementVisionOSBundleVersion(
      __dirname,
      {
        minor: 2,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(0);
  });

  it("Increment VisionOS bundle version patch by 3", () => {
    const result = UnityVersioningTools.incrementVisionOSBundleVersion(
      __dirname,
      {
        patch: 3,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  it("Leave VisionOS bundle version unchanged", () => {
    const result = UnityVersioningTools.incrementVisionOSBundleVersion(
      __dirname,
      {}
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  /*####################################################################################
  # Set VisionOS bundle version tests
  ####################################################################################*/

  it("Set VisionOS bundle version major to 1", () => {
    const result = UnityVersioningTools.setVisionOSBundleVersion(__dirname, {
      major: 1,
    });
    expect(result.major).to.equal(1);
  });

  it("Set VisionOS bundle version minor to 1", () => {
    const result = UnityVersioningTools.setVisionOSBundleVersion(__dirname, {
      minor: 1,
    });
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
  });

  it("Set VisionOS bundle version patch to 1", () => {
    const result = UnityVersioningTools.setVisionOSBundleVersion(__dirname, {
      patch: 1,
    });
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  it("Leave VisionOS bundle version unchanged", () => {
    const result = UnityVersioningTools.setVisionOSBundleVersion(__dirname, {});
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });
});

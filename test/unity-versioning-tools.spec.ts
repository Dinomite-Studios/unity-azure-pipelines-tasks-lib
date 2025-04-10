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
    const result = UnityVersioningTools.updateBuildNumber(__dirname, true, {
      Standalone: 1,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(0);
    expect(result.iPhone).to.equal(0);
    expect(result.tvOS).to.equal(0);
  });

  it("Increment VisionOS build number by 2", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, true, {
      VisionOS: 2,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(2);
    expect(result.iPhone).to.equal(0);
    expect(result.tvOS).to.equal(0);
  });

  it("Increment iPhone build number by 3", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, true, {
      iPhone: 3,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(2);
    expect(result.iPhone).to.equal(3);
    expect(result.tvOS).to.equal(0);
  });

  it("Increment tvOS build number by 4", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, true, {
      tvOS: 4,
    });
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(2);
    expect(result.iPhone).to.equal(3);
    expect(result.tvOS).to.equal(4);
  });

  it("Leave build numbers unchanged", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, true, {});
    expect(result.Standalone).to.equal(1);
    expect(result.VisionOS).to.equal(2);
    expect(result.iPhone).to.equal(3);
    expect(result.tvOS).to.equal(4);
  });

  it("Increment all build numbers by 1", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, true, {
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
    const result = UnityVersioningTools.updateBuildNumber(__dirname, false, {
      Standalone: 20,
    });
    expect(result.Standalone).to.equal(20);
  });

  it("Set VisionOS build number to 20", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, false, {
      VisionOS: 20,
    });
    expect(result.Standalone).to.equal(20);
    expect(result.VisionOS).to.equal(20);
  });

  it("Set iPhone build number to 20", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, false, {
      iPhone: 20,
    });
    expect(result.Standalone).to.equal(20);
    expect(result.VisionOS).to.equal(20);
    expect(result.iPhone).to.equal(20);
  });

  it("Set tvOS build number to 20", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, false, {
      tvOS: 20,
    });
    expect(result.Standalone).to.equal(20);
    expect(result.VisionOS).to.equal(20);
    expect(result.iPhone).to.equal(20);
    expect(result.tvOS).to.equal(20);
  });

  it("Leave build numbers unchanged", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, false, {});
    expect(result.Standalone).to.equal(20);
    expect(result.VisionOS).to.equal(20);
    expect(result.iPhone).to.equal(20);
    expect(result.tvOS).to.equal(20);
  });

  it("Set all build numbers to 1", () => {
    const result = UnityVersioningTools.updateBuildNumber(__dirname, false, {
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
    const result = UnityVersioningTools.updateAndroidBundleVersionCode(
      __dirname,
      true,
      1
    );
    expect(result).to.equal(2);
  });

  it("Leave Android bundle version code unchanged", () => {
    const result = UnityVersioningTools.updateAndroidBundleVersionCode(
      __dirname,
      true,
      0
    );
    expect(result).to.equal(2);
  });

  /*####################################################################################
  # Set Android bundle version code tests
  ####################################################################################*/

  it("Set Android bundle version code to 20", () => {
    const result = UnityVersioningTools.updateAndroidBundleVersionCode(
      __dirname,
      false,
      20
    );
    expect(result).to.equal(20);
  });

  /*####################################################################################
  # Increment bundle version tests
  ####################################################################################*/

  it("Increment bundle version major by 1", () => {
    const result = UnityVersioningTools.updateBundleVersion(__dirname, true, {
      major: 1,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(0);
    expect(result.patch).to.equal(0);
  });

  it("Increment bundle version minor by 2", () => {
    const result = UnityVersioningTools.updateBundleVersion(__dirname, true, {
      minor: 2,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(0);
  });

  it("Increment bundle version patch by 3", () => {
    const result = UnityVersioningTools.updateBundleVersion(__dirname, true, {
      patch: 3,
    });
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  it("Leave bundle version unchanged", () => {
    const result = UnityVersioningTools.updateBundleVersion(
      __dirname,
      true,
      {}
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  /*####################################################################################
  # Set bundle version tests
  ####################################################################################*/

  it("Set bundle version major to 1", () => {
    const result = UnityVersioningTools.updateBundleVersion(__dirname, false, {
      major: 1,
    });
    expect(result.major).to.equal(1);
  });

  it("Set bundle version minor to 1", () => {
    const result = UnityVersioningTools.updateBundleVersion(__dirname, false, {
      minor: 1,
    });
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
  });

  it("Set bundle version patch to 1", () => {
    const result = UnityVersioningTools.updateBundleVersion(__dirname, false, {
      patch: 1,
    });
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  it("Leave bundle version unchanged", () => {
    const result = UnityVersioningTools.updateBundleVersion(
      __dirname,
      false,
      {}
    );
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  /*####################################################################################
  # Increment tvOS bundle version tests
  ####################################################################################*/

  it("Increment tvOS bundle version major by 1", () => {
    const result = UnityVersioningTools.updateTvOSBundleVersion(
      __dirname,
      true,
      {
        major: 1,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(0);
    expect(result.patch).to.equal(0);
  });

  it("Increment tvOS bundle version minor by 2", () => {
    const result = UnityVersioningTools.updateTvOSBundleVersion(
      __dirname,
      true,
      {
        minor: 2,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(0);
  });

  it("Increment tvOS bundle version patch by 3", () => {
    const result = UnityVersioningTools.updateTvOSBundleVersion(
      __dirname,
      true,
      {
        patch: 3,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  it("Leave tvOS bundle version unchanged", () => {
    const result = UnityVersioningTools.updateTvOSBundleVersion(
      __dirname,
      true,
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
    const result = UnityVersioningTools.updateTvOSBundleVersion(
      __dirname,
      false,
      {
        major: 1,
      }
    );
    expect(result.major).to.equal(1);
  });

  it("Set tvOS bundle version minor to 1", () => {
    const result = UnityVersioningTools.updateTvOSBundleVersion(
      __dirname,
      false,
      {
        minor: 1,
      }
    );
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
  });

  it("Set tvOS bundle version patch to 1", () => {
    const result = UnityVersioningTools.updateTvOSBundleVersion(
      __dirname,
      false,
      {
        patch: 1,
      }
    );
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  it("Leave tvOS bundle version unchanged", () => {
    const result = UnityVersioningTools.updateTvOSBundleVersion(
      __dirname,
      false,
      {}
    );
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  /*####################################################################################
  # Increment VisionOS bundle version tests
  ####################################################################################*/

  it("Increment VisionOS bundle version major by 1", () => {
    const result = UnityVersioningTools.updateVisionOSBundleVersion(
      __dirname,
      true,
      {
        major: 1,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(0);
    expect(result.patch).to.equal(0);
  });

  it("Increment VisionOS bundle version minor by 2", () => {
    const result = UnityVersioningTools.updateVisionOSBundleVersion(
      __dirname,
      true,
      {
        minor: 2,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(0);
  });

  it("Increment VisionOS bundle version patch by 3", () => {
    const result = UnityVersioningTools.updateVisionOSBundleVersion(
      __dirname,
      true,
      {
        patch: 3,
      }
    );
    expect(result.major).to.equal(2);
    expect(result.minor).to.equal(2);
    expect(result.patch).to.equal(3);
  });

  it("Leave VisionOS bundle version unchanged", () => {
    const result = UnityVersioningTools.updateVisionOSBundleVersion(
      __dirname,
      true,
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
    const result = UnityVersioningTools.updateVisionOSBundleVersion(
      __dirname,
      false,
      {
        major: 1,
      }
    );
    expect(result.major).to.equal(1);
  });

  it("Set VisionOS bundle version minor to 1", () => {
    const result = UnityVersioningTools.updateVisionOSBundleVersion(
      __dirname,
      false,
      {
        minor: 1,
      }
    );
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
  });

  it("Set VisionOS bundle version patch to 1", () => {
    const result = UnityVersioningTools.updateVisionOSBundleVersion(
      __dirname,
      false,
      {
        patch: 1,
      }
    );
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });

  it("Leave VisionOS bundle version unchanged", () => {
    const result = UnityVersioningTools.updateVisionOSBundleVersion(
      __dirname,
      false,
      {}
    );
    expect(result.major).to.equal(1);
    expect(result.minor).to.equal(1);
    expect(result.patch).to.equal(1);
  });
});

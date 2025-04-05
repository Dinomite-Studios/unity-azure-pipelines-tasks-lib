// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import "mocha";
import { expect } from "chai";
import { UnityVersioningTools } from "../dist";

describe("UnityVersioningTools", () => {
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

  it("Increment Android bundle version code by 1", () => {
    const result = UnityVersioningTools.incrementAndroidBundleVersionCode(
      __dirname,
      1
    );
    expect(result).to.equal(2);
  });
});

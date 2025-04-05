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
    expect(result).to.equal({
      Standalone: 1,
      VisionOS: 0,
      iPhone: 0,
      tvOS: 0,
    });
  });
});

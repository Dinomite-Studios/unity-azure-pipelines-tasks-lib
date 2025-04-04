// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import "mocha";
import { expect } from "chai";
import { UnityBundleVersionTools } from "../dist";

describe("UnityBundleVersionTools", () => {
  it("Increment standalone build number by 1", () => {
    const result = UnityBundleVersionTools.incrementBuildNumber(__dirname, {
      Standalone: 1,
    });
    expect(result.Standalone).to.equal(1);
  });
});

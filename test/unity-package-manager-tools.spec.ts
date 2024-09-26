// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import 'mocha';
import { expect } from 'chai';
import { UnityPackageManagerTools } from '../dist';

describe('UnityPackageManagerTools',
    () => {
        it('Invalid file path should return error', () => {
            const error = UnityPackageManagerTools.addPackageToProject('XYZ:\\This\\Path\\Does\\Not\\Exist', 'games.dinomite.azurepipelines', 'https://github.com/Dinomite-Studios/unity-azure-pipelines-tasks-build-scripts.git');
            expect(error);
        });

        it('games.dinomite.azurepipelines package was added to manifest', () => {
            const error = UnityPackageManagerTools.addPackageToProject(__dirname, 'games.dinomite.azurepipelines', 'https://github.com/Dinomite-Studios/unity-azure-pipelines-tasks-build-scripts.git');
            expect(!error);
        });

        it('games.dinomite.azurepipelines package was removed from manifest', () => {
            const error = UnityPackageManagerTools.removePackageFromProject(__dirname, 'games.dinomite.azurepipelines');
            expect(!error);
        });
    });
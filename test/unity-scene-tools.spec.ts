// Copyright (c) Dinomite. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import 'mocha';
import { expect } from 'chai';
import { UnitySceneTools } from '../dist';

describe('UnitySceneTools',
    () => {
        it('Create new empty scene', () => {
            const error = UnitySceneTools.createSceneAt(__dirname, 'Assets/DummyDinoScene.unity', false);
            expect(!error);
        });

        it('Add scene to editor build configuration', () => {
            const error = UnitySceneTools.addSceneToBuildSettings(__dirname, true, 'Assets/DummyDinoScene.unity', 'testguid');
            expect(!error);
        });
    });
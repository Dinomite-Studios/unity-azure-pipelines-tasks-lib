// Copyright (c) Dinomite Studios. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

import 'mocha';
import { expect } from 'chai';
import { UnityVersionTools } from '../dist';
import { UnityVersionInfo } from '../lib/models';

describe('UnityVersionTools',
    () => {
        it('Invalid file path should return error', () => {
            const { error } = UnityVersionTools.determineProjectVersionFromFile('XYZ:\\This\\Path\\Does\\Not\\Exist');

            expect(error);
        });

        it('Test ProjectVersion.txt should return 2020.2.0f1 (3721df5a8b28) stable', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromFile(__dirname);
            const expectedResult: UnityVersionInfo = {
                version: '2020.2.0f1',
                revision: '3721df5a8b28',
                isAlpha: false,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('empty string should return error', () => {
            const { error } = UnityVersionTools.determineProjectVersionFromContent('');

            expect(error);
        });

        it('should return 2017.1.0f1 stable', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 2017.1.0f1');
            const expectedResult: UnityVersionInfo = {
                version: '2017.1.0f1',
                isAlpha: false,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 2017.2.0a1 alpha', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 2017.2.0a1');
            const expectedResult: UnityVersionInfo = {
                version: '2017.2.0a1',
                isAlpha: true,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 2017.3.7b1 beta', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 2017.3.7b1');
            const expectedResult: UnityVersionInfo = {
                version: '2017.3.7b1',
                isAlpha: false,
                isBeta: true
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 5.3.1f1 stable', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 5.3.1f1');
            const expectedResult: UnityVersionInfo = {
                version: '5.3.1f1',
                isAlpha: false,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 5.3.1p3 stable', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 5.3.1p3');
            const expectedResult: UnityVersionInfo = {
                version: '5.3.1p3',
                isAlpha: false,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 5.3.7f1 stable when standard assets are in project', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 5.3.7f1\nm_StandardAssetsVersion: 0');
            const expectedResult: UnityVersionInfo = {
                version: '5.3.7f1',
                isAlpha: false,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 2020.1.6f1 (fc477ca6df10) stable', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 2020.1.6f1\nm_EditorVersionWithRevision: 2020.1.6f1 (fc477ca6df10)');
            const expectedResult: UnityVersionInfo = {
                version: '2020.1.6f1',
                revision: 'fc477ca6df10',
                isAlpha: false,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 2019.4.17f1 (123456abcd) stable when standard assets are in project', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 2019.4.17f1\nm_EditorVersionWithRevision: 2019.4.17f1 (123456abcd)\nm_StandardAssetsVersion: 0');
            const expectedResult: UnityVersionInfo = {
                version: '2019.4.17f1',
                revision: '123456abcd',
                isAlpha: false,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 2021.1.0b1 (fc123ca634gfd0) beta', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 2021.1.0b1\nm_EditorVersionWithRevision: 2021.1.0b1 (fc123ca634gfd0)');
            const expectedResult: UnityVersionInfo = {
                version: '2021.1.0b1',
                revision: 'fc123ca634gfd0',
                isAlpha: false,
                isBeta: true
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });

        it('should return 2021.2.0a1 (fc123ca634gfd0) alpha', () => {
            const { info, error } = UnityVersionTools.determineProjectVersionFromContent('m_EditorVersion: 2021.2.0a1\nm_EditorVersionWithRevision: 2021.2.0a1 (fc123ca634gfd0)');
            const expectedResult: UnityVersionInfo = {
                version: '2021.2.0a1',
                revision: 'fc123ca634gfd0',
                isAlpha: true,
                isBeta: false
            };

            expect(!error);
            expect(info);
            expect(resultsAreEqual(info!, expectedResult)).to.equal(true);
        });
    });

function resultsAreEqual(a: UnityVersionInfo, b: UnityVersionInfo): boolean {
    return a.version === b.version &&
        a.revision === b.revision &&
        a.isAlpha === b.isAlpha &&
        a.isBeta === b.isBeta
};
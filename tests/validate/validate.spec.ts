/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import * as fs from "fs";
import * as path from "path";
import { Validate } from "../../src/validate";

jest.mock("../../src/exec");

describe("Test validate", () => {

    let validate: Validate;
    const pluginPath = "/tmp/package.json";
    const rootFolder = process.cwd();
    const validatePath = path.resolve(rootFolder, "tests/validate");

    beforeEach(() => {
        validate = new Validate(validatePath);
    });

    test("no engine", async () => {
        const packageJson = JSON.parse(fs.readFileSync(__dirname
             + "/missing-engine-package.json").toString());
        let error;
        try {
            await validate.validateEngine(packageJson, pluginPath);
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toMatch(/There is no "engines" section.*$/m);
    });

    test("no theia engine", async () => {
        const packageJson = JSON.parse(fs.readFileSync(__dirname
             + "/missing-engine-theia-package.json").toString());
        let error;
        try {
            await validate.validateEngine(packageJson, pluginPath);
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toMatch(/There is a missing theiaPlugin "engine" section.*$/m);
    });

    test("no theiaPlugin", async () => {
        const packageJson = JSON.parse(fs.readFileSync(__dirname
             + "/missing-theia-plugin-package.json").toString());
        let error;
        try {
            await validate.validatePluginEntry(packageJson, pluginPath);
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toMatch(/There is no "theiaPlugin" section.*$/m);
    });

    test("missing entries in theiaPlugin", async () => {
        const packageJson = JSON.parse(fs.readFileSync(__dirname
             + "/missing-theia-plugin-incomplete-package.json").toString());
        let error;
        try {
            await validate.validatePluginEntry(packageJson, pluginPath);
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toMatch(/The value inside theiaPlugin section is not valid.*$/m);
    });

    test("invalid entries in theiaPlugin", async () => {
        const packageJson = JSON.parse(fs.readFileSync(__dirname
             + "/missing-theia-plugin-incomplete2-package.json").toString());
        let error;
        try {
            await validate.validatePluginEntry(packageJson, pluginPath);
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toMatch(/The value inside theiaPlugin section is not valid.*$/m);
    });

    test("invalid entry in theiaPlugin.frontend", async () => {
        const packageJson = JSON.parse(fs.readFileSync(__dirname
             + "/missing-theia-plugin-frontend-invalid-package.json").toString());
        let error;
        try {
            await validate.validatePluginEntry(packageJson, pluginPath);
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toMatch(/The value inside theiaPlugin.frontend is not valid.*$/m);
    });

    test("invalid entry in theiaPlugin.backend", async () => {
        const packageJson = JSON.parse(fs.readFileSync(__dirname
             + "/missing-theia-plugin-backend-invalid-package.json").toString());
        let error;
        try {
            await validate.validatePluginEntry(packageJson, pluginPath);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toMatch(/The value inside theiaPlugin.backend is not valid.*$/m);
    });

    test("no package.json", async () => {
        validate = new Validate(path.resolve(rootFolder, "tests/validate/foo"));
        let error;
        try {
            await validate.check();
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toMatch(/The plugin is not having any package.json file.*$/m);
    });

    test("valid package.json", async () => {
        await validate.check();
    });

});

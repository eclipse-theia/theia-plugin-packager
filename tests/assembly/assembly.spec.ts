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
import * as tmp from "tmp";
import { Assembly } from "../../src/assembly";
import { Exec } from "../../src/exec";
import { Yarn } from "../../src/yarn";

jest.mock("../../src/exec");
jest.unmock("archiver");

describe("Test Assembly", () => {

    let tmpZip: string;
    const rootFolder = process.cwd();
    const assemblyExamplePath = path.resolve(rootFolder, "tests/assembly/assembly-example");
    let write;
    let output = "";

    const cleanup = () => {
        process.stdout.write = write;
    };

    beforeEach(() => {
        output = "";
        write = process.stdout.write;
        (process.stdout as any).write = (value: string) => {
            output += value;
        };
        tmpZip = tmp.fileSync({ mode: 0o644, prefix: "tmpZip", postfix: ".zip" }).name;
    });

    afterEach(() => {
        cleanup();
        fs.unlinkSync(tmpZip);
    });

    test("test assembly", async () => {

        const execOutput = '{"type":"tree","data":{"type":"list","trees":[{"name":"dummy@1.1.2"'
         + ',"children":[],"hint":null,"color":"bold","depth":0}]}}';
        (Exec as any).__setCommandOutput(Yarn.YARN_GET_DEPENDENCIES, execOutput);

        const assembly = new Assembly(assemblyExamplePath, tmpZip);
        await assembly.create();
    });

    test("test missing file", async () => {

        const execOutput = '{"type":"tree","data":{"type":"list","trees":[{"name":"unknown@1.1.2","children":[],'
         + '"hint":null,"color":"bold","depth":0}]}}';
        (Exec as any).__setCommandOutput(Yarn.YARN_GET_DEPENDENCIES, execOutput);

        const assembly = new Assembly(assemblyExamplePath, tmpZip);
        let error = null;
        try {
        await assembly.create();
        } catch (err) {
        error = err;
        }
        expect(error).toBeDefined();
        expect(error.message).toMatch("not available on the filesystem");
    });

});

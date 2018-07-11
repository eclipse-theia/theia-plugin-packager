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
import * as unzipper from "unzipper";
import { Zip } from "../../src/zip";

jest.unmock("archiver");

describe("Test zip", () => {

    let zip: Zip;
    let tmpZip: string;

    beforeEach(() => {
        tmpZip = tmp.fileSync({ mode: 0o644, prefix: "tmpZip", postfix: ".zip" }).name;
        zip = new Zip();
    });

    afterEach(() => {
        fs.unlinkSync(tmpZip);
    });

    test("package zip file", async () => {
        const rootFolder = process.cwd();
        const zipExamplePath = path.resolve(rootFolder, "tests/zip/zip-example");

        await zip.zipFiles([path.resolve(zipExamplePath, "foo.entry"),
        path.resolve(zipExamplePath, "foo.entry2"),
        path.resolve(zipExamplePath, "subfolder/foo.subentry")], tmpZip, zipExamplePath);

        let foundFooEntry = false;
        let foundFooEntry2 = false;
        let foundSubFolerFooSubentry = false;
        let foundAnotherEntry = null;
        // now check the content of the zip file
        await fs.createReadStream(tmpZip)
            .pipe(unzipper.Parse())
            .on("entry", (entry) => {
                const fileName = entry.path;
                const type = entry.type;
                const size = entry.size;
                if (fileName === "foo.entry") {
                    foundFooEntry = true;
                } else if (fileName === "foo.entry2") {
                    foundFooEntry2 = true;
                } else if (fileName === "subfolder/foo.subentry") {
                    foundSubFolerFooSubentry = true;
                } else {
                    foundAnotherEntry = fileName;
                }
                entry.autodrain();

            }).promise();

        expect(foundFooEntry).toBeTruthy();
        expect(foundFooEntry2).toBeTruthy();
        expect(foundSubFolerFooSubentry).toBeTruthy();
        expect(foundAnotherEntry).toBeNull();

    });

    test("invalid zip entry", async () => {
        const rootFolder = process.cwd();

        const zipExamplePath = path.resolve(rootFolder, "tests/zip/zip-example");

        let error = null;
        try {
        await zip.zipFiles([path.resolve(zipExamplePath, "foo.entry-does-not-exist")], tmpZip, zipExamplePath);
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(error.message).toBeDefined();

    });

});

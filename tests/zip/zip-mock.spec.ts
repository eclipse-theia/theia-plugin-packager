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

jest.mock("archiver");

describe("Test zip with mocks", () => {

    let tmpZip: string;

    beforeEach(() => {
        tmpZip = tmp.fileSync({ mode: 0o644, prefix: "tmpZip", postfix: ".zip" }).name;
    });

    afterEach(() => {
        fs.unlinkSync(tmpZip);
    });

    test("invalid zip error", async () => {
        const zip = new Zip();

        let error = null;
        try {
        await zip.zipFiles(["foo.entry"], tmpZip, "zipExamplePath");
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();

    });

});

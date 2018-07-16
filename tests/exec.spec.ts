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
import { Exec } from "../src/exec";

describe("Test Exec", () => {

    test("test exec", async () => {
        const result = await Exec.run("echo 'foo'");
        expect(result).toBe("foo\n");
    });

    test("test exec error", async () => {
        let error;
        try {
            await Exec.run("invalid-command-not-exists");
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
    });

});

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
import { Step } from "../../src/step";

describe("Test Step", () => {

    let write;
    let output = "";

    // restore process.stdout.write() and console.log() to their previous glory
    const cleanup = () => {
        process.stdout.write = write;
    };

    beforeEach(() => {
        output = "";
        // store these functions to restore later because we are messing with them
        write = process.stdout.write;
        // our stub will concatenate any output to a string
        (process.stdout as any).write = (value: string) => {
            output += value;
        };
    });

    // restore after each test
    afterEach(cleanup);

    let step: Step;

    test("success step", async () => {
        const working = false;

        const callback = (): Promise<boolean> => {
            return Promise.resolve(true);
        };
        step = new Step("✅", "it should work", callback);
        await step.start();
        expect(output).toBe("✅ it should work...✔️ \n");
    });

    test("failure step", async () => {
        const working = false;

        const callback = (): Promise<boolean> => {
            throw new Error("invalid");
        };
        step = new Step("❌️", "it should fail", callback);
        let error = null;
        try {
            await step.start();
        } catch (e) {
            error = e;
        }
        expect(output).toBe("❌️ it should fail...❌️ \n");
        expect(error).toBeDefined();
    });

});

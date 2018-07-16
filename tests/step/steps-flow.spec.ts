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
import { StepsFlow } from "../../src/steps-flow";

describe("Test Step Flow", () => {
    let write;
    let output = "";

    let stepsFlow: StepsFlow;

    const cleanup = () => {
        process.stdout.write = write;
    };

    beforeEach(() => {
        output = "";
        write = process.stdout.write;
        (process.stdout as any).write = (value: string) => {
            output += value;
        };
    });

    afterEach(cleanup);

    test("success steps Flow", async () => {
        stepsFlow = new StepsFlow("test");
        let step1called = false;
        let step2called = false;
        stepsFlow.addStep(new Step("1", "first", () => Promise.resolve(step1called = true)));
        stepsFlow.addStep(new Step("2", "second", () => Promise.resolve(step2called = true)));
        await stepsFlow.start();
        expect(step1called).toBeTruthy();
        expect(step2called).toBeTruthy();
    });

    test("success steps Flow", async () => {
        stepsFlow = new StepsFlow("test");
        let step1called = false;
        const step2called = false;
        stepsFlow.addStep(new Step("1", "first", () => Promise.resolve(step1called = true)));
        stepsFlow.addStep(new Step("2", "second", () => { throw new Error("error in step"); }));
        let error = null;

        try {
            await stepsFlow.start();
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        expect(step1called).toBeTruthy();
        expect(step2called).toBeFalsy();
});

});

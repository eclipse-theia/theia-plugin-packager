/*********************************************************************
* Copyright (c) 2018-2019 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

import { Logger } from "../src/logger";

describe("Test Logger", () => {

    test("test debug enabled", async () => {
        const msg = 'Debug log';
        Logger.DEBUG_ENABLED = true;
        console.debug = jest.fn();
        Logger.debug(msg);
        expect((console.debug as any).mock.calls[0][0]).toBe(msg);
    });

    test("test debug disabled", async () => {
        const msg = 'Debug log';
        Logger.DEBUG_ENABLED = false;
        console.debug = jest.fn();
        Logger.debug(msg);
        expect((console.debug as any).mock.calls.length).toBe(0);
    });


    test("test info", async () => {
        const msg = 'Info log';
        console.info = jest.fn();
        Logger.info(msg);
        expect((console.info as any).mock.calls[0][0]).toBe(msg);
    });

    test("test error", async () => {
        const msg = 'Error log';
        console.error = jest.fn();
        Logger.error(msg);
        expect((console.error as any).mock.calls[0][0]).toBe(msg);
    });

});

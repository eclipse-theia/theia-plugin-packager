/*********************************************************************
* Copyright (c) 2018-2019 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

/**
 * Mock of the command class.
 */
export class Command {

    /**
     * Map between the name of the exec command and the output.
     */
    private static readonly execMap: Map<string, string> = new Map();

    /**
     * Map between the name of the exec command and the error output.
     */
    private static readonly errorMap: Map<string, string> = new Map();

    // mock any exec command by providing the output
    public static __setExecCommandOutput(command: string, output: string): void {
        Command.execMap.set(command, output);
    }

    // mock any exec command by providing the output
    public static __setExecError(command: string, error: string): void {
        Command.errorMap.set(command, error);
    }

    constructor() {

    }

    public async exec(command: string): Promise<string> {
        const error = Command.errorMap.get(command);
        if (error) {
            Command.errorMap.delete(command);
            throw new Error(error);
        }

        const result = Command.execMap.get(command);
        if (result) {
            return Promise.resolve(result);
        } else {
            return Promise.resolve('');
        }
    }

}

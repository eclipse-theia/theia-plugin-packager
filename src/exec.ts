/*********************************************************************
* Copyright (c) 2018 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

import * as cp from "child_process";

/**
 * Allow to run some commands
 * @author Florent Benoit
 */
export class Exec {

    public static async run(command: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const execProcess = cp.exec(command, {
            }, (error, stdout, stderr) => {
                const exitCode = (execProcess as any).exitCode;
                if (error) {
                    reject(stderr);
                }
                if (exitCode !== 0) {
                    reject("Invalid exit code " + exitCode);
                }
                resolve(stdout);
            });
        });
    }

}

/*********************************************************************
* Copyright (c) 2018 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

/**
 * Print emoji with content of action, then call the action. If it's working then it adds valid check, else an error
 * @author Florent Benoit
 */
export class Step {

    constructor(readonly emoji: string, readonly content: string, readonly callback: () => Promise<any>) {

    }

    public async start(): Promise<void> {
        process.stdout.write(this.emoji + " " + this.content + "...");
        try {
            await this.callback();
        } catch (error) {
            this.error();
            throw error;
        }
        this.succeed();
    }

    private succeed(): void {
        process.stdout.write("✔️ \n");
    }

    private error(): void {
        process.stdout.write("❌️ \n");
    }

}

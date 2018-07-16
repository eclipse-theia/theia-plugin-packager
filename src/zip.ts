/*********************************************************************
* Copyright (c) 2018 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

import * as archiver from "archiver";
import * as fs from "fs";
import * as path from "path";

/**
 * Wrap plugin into a zip file
 * @author Florent Benoit
 */
export class Zip {

    /**
     * Handle the zip step
     */
    public async zipFiles(files: string[], zipPath: string, rootFolder: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const archive = archiver("zip", { zlib: { level: 9 } });
            const zipFile = fs.createWriteStream(zipPath);

            zipFile.on("close", () => {
                resolve();
            });

            archive.on("warning", (err) => {
                // throw error
                reject(err);
            });

            // good practice to catch this error explicitly
            archive.on("error", (err) => {
                reject(err);
            });

            // pipe archive data to the file
            archive.pipe(zipFile);

            // add all required files
            files.forEach((file) => {
                archive.file(file, { name: path.relative(rootFolder, file) });
            });

            archive.finalize();
        });

    }
}

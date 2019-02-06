/*********************************************************************
* Copyright (c) 2018-2019 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

import chalk from "chalk";
import * as fs from "fs";
import * as glob from "glob-promise";
import * as micromatch from "micromatch";
import * as path from "path";
import { CliError } from "./cli-error";
import { Step } from "./step";
import { StepsFlow } from "./steps-flow";
import { Validate } from "./validate";
import { Yarn } from "./yarn";
import { Zip } from "./zip";

/**
 * Generates the plugin assembly (zip file)
 * @author Florent Benoit
 */
export class Assembly {

    private stepsFlow: StepsFlow;
    private dependencies: string[] = [];
    private toZipFiles: string[] = [];

    private readonly validate: Validate;

    // default list of ignore pattern
    private ignoreZipPattern = [".git", ".gitignore"];

    constructor(readonly pluginRootFolder: string, readonly zipPath: string) {
        this.dependencies = [];
        this.toZipFiles = [];

        this.validate = new Validate(this.pluginRootFolder);

        this.stepsFlow = new StepsFlow(chalk.bold("Packaging of plugin"));

        this.stepsFlow.addStep(new Step("🔍", "Validating", () => this.validate.check()));
        this.stepsFlow.addStep(new Step("🗂", " Getting dependencies", () => this.getDependencies()));
        this.stepsFlow.addStep(new Step("🗃", " Resolving files", () => this.resolveFiles()));
        this.stepsFlow.addStep(new Step("✂️", " Excluding files", () => this.excludeFiles()));
        this.stepsFlow.addStep(new Step("✍️", " Generating Assembly", () => this.createZip()));

    }

    public async create(): Promise<fs.PathLike> {
        await this.stepsFlow.start();

        return new Promise<fs.PathLike>((resolve, reject) => {
            resolve("🎉 Generated plugin: " + chalk.bold(path.relative(this.pluginRootFolder, this.zipPath)));
        });

    }

    public async resolveFiles(): Promise<boolean> {
        // check dependency folders are there
        this.dependencies.forEach((dependency) => {
            if (!fs.existsSync(dependency)) {
                throw new CliError("The dependency " + dependency
                    + " is referenced but is not available on the filesystem");
            }
        });

        // ok now, add all files from these dependencies except their sub folder node_modules as we already got them
        const globOptions = { nocase: true, nosort: true, ignore: "node_modules/**", nodir: true, dot: true };
        this.toZipFiles = this.toZipFiles.concat.apply([],
            await Promise.all(this.dependencies.map((dependencyDirectory) => {
                return glob.promise("**", Object.assign(globOptions, { cwd: dependencyDirectory }))
                    .then((data) => data.map((name) => path.join(dependencyDirectory, name)));
            })));

        // add as well the current folder without node_modules (as it comes from dependencies)
        this.toZipFiles = this.toZipFiles.concat(
            await (glob.promise("**", Object.assign(globOptions, { cwd: this.pluginRootFolder }),
            )).then((data: string[]) => data.map((name) => path.join(this.pluginRootFolder, name))));

        return Promise.resolve(true);
    }

    public async excludeFiles(): Promise<boolean> {

        // skip the generated zip file
        this.ignoreZipPattern.push(path.relative(this.pluginRootFolder, this.zipPath));

        // need to exclude some files
        this.toZipFiles = this.toZipFiles.filter((file) => {
            // relative path
            const relativeFile = path.relative(this.pluginRootFolder, file);

            // filter out entries that are matching the patterns
            return !micromatch.contains(relativeFile, this.ignoreZipPattern);
        });
        return Promise.resolve(true);
    }

    public async createZip(): Promise<string> {
        const zip = new Zip();
        return zip.zipFiles(this.toZipFiles, this.zipPath, this.pluginRootFolder);

    }

    public async getDependencies(): Promise<boolean> {

        // current module name
        const moduleName = this.validate.pluginPackageJson.name;
        this.dependencies = (await new Yarn(this.pluginRootFolder, this.pluginRootFolder, [], []).getDependencies(moduleName));
        return Promise.resolve(true);
    }

}

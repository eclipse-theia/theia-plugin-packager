/*********************************************************************
* Copyright (c) 2018 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { CliError } from "./cli-error";

/**
 * Validate the plugin before running packaging on it.
 * @author Florent Benoit
 */
export class Validate {

    constructor(readonly pluginRootFolder: string) {

    }

    public async check(): Promise<boolean> {
        // load package.json
        const packageJsonPath = this.pluginRootFolder + path.sep + "package.json";

        if (!fs.existsSync(packageJsonPath)) {
            throw new CliError("The plugin is not having any package.json file");
        }
        const pluginPackageJson: any = require(packageJsonPath);
        this.validateEngine(pluginPackageJson, packageJsonPath);
        this.validatePluginEntry(pluginPackageJson, packageJsonPath);

        // TODO: check for yarn.lock

        return Promise.resolve(true);
    }

    public validateEngine(pluginPackageJson: any, packageJsonPath: string): void {

        const missingEngineSuggest = "You need to add "
            + chalk.italic('\n  "engines": \{\n    "theiaPlugin": "latest"\n  \}\n')
            + "\(you may replace latest with a semver version)";
        if (!(pluginPackageJson.engines)) {
            throw new CliError('There is no "engines" section in the '
                + packageJsonPath + " file. " + missingEngineSuggest);
        } else if (!pluginPackageJson.engines.theiaPlugin) {
            throw new CliError('There is a missing theiaPlugin "engine" section in the '
                + packageJsonPath + " file. " + missingEngineSuggest);
        }
    }

    public validatePluginEntry(pluginPackageJson: any, packageJsonPath: string): void {

        const missingPluginSuggest = "You need to add "
            + chalk.italic('\n  "theiaPlugin": \{\n    "backend": "./path/to/the/entrypoint.js"\n  \}\n')
            + "for a backend plugin or \n"
            + chalk.italic('\n  "theiaPlugin": \{\n    "frontend": "./path/to/the/entrypoint.js"\n  \}\n'
                + " for a frontend plugin");
        if (!pluginPackageJson.theiaPlugin) {
            throw new CliError('There is no "theiaPlugin" section in the '
                + packageJsonPath + " file. " + missingPluginSuggest);
        } else if (!(pluginPackageJson.theiaPlugin.frontend
            || pluginPackageJson.theiaPlugin.backend
            || pluginPackageJson.theiaPlugin.worker)) {
            const keys = Object.keys(pluginPackageJson.theiaPlugin);
            if (!keys || keys.length === 0) {
                throw new CliError("The value inside theiaPlugin section is not valid."
                    + " Expecting frontend or backend sub-entries but there was no entry");
            } else {
                throw new CliError("The value inside theiaPlugin section is not valid."
                    + " Expecting frontend or backend sub-entries but found entries " + keys);
            }
        }

        // expect entries are there, test if linked file are present on the filesystem
        if (pluginPackageJson.theiaPlugin.frontend) {
            const frontendPath = this.pluginRootFolder + path.sep + pluginPackageJson.theiaPlugin.frontend;
            if (!fs.existsSync(frontendPath)) {
                throw new CliError("The value inside theiaPlugin.frontend is not valid."
                    + " The referenced file " + frontendPath + " does not exists.");
            }
        }
        if (pluginPackageJson.theiaPlugin.backend) {
            const backendPath = this.pluginRootFolder + path.sep + pluginPackageJson.theiaPlugin.backend;
            if (!fs.existsSync(backendPath)) {
                throw new CliError("The value inside theiaPlugin.backend is not valid. The referenced file "
                    + backendPath + " does not exists.");
            }
        }

    }
}

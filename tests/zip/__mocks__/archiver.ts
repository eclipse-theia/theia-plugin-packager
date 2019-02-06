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
 * Fake errors
 */
module.exports = (): any => {
    /* tslint:disable:no-empty */

    return {
        on: (type, callback) => {
            if (type === "error") {
                callback(new Error("error from archive"));
            }
        },

        pipe: () => {

        },

        file: () => {

        },

        finalize: () => {

        },

    };
};

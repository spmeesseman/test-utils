/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @file plugin/dispose.js
 * @author Scott Meesseman
 */

import { isPromise } from "../utils";
import WpBuildBasePlugin from "./base";

/** @typedef {import("../types").WebpackCompiler} WebpackCompiler */
/** @typedef {import("../types").WebpackStatsAsset} WebpackStatsAsset */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WpBuildPluginOptions} WpBuildPluginOptions */


/**
 * @class WpBuildDisposePlugin
 */
class WpBuildDisposePlugin extends WpBuildBasePlugin
{
    /**
     * @function Called by webpack runtime to initialize this plugin
     * @override
     * @param {WebpackCompiler} compiler the compiler instance
     * @returns {void}
     */
    apply(compiler)
    {
        this.onApply(compiler,
        {
            cleanupRegisteredDisposables: {
                async: true,
                hook: "shutdown",
                callback: this.dispose.bind(this)
            }
        });
    }

    async dispose()
    {
        this.logger.write("cleanup: call all registered disposables", 2);
        for (const d of this.env.disposables.splice(0))
        {
            const result = d.dispose();
            if (isPromise(result)) {
                await result;
            }
        }
    }
}


/**
 * @function
 * @param {WpBuildEnvironment} env
 * @returns {WpBuildDisposePlugin}
 */
const dispose = (env) => new WpBuildDisposePlugin({ env });


export default dispose;

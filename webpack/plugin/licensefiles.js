/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuild.plugin.licensefiles
 */

import { join } from "path";
import { existsSync } from "fs";
import WpBuildBasePlugin from "./base";
import { rename, unlink, readdir } from "fs/promises";

/** @typedef {import("../types").WebpackCompiler} WebpackCompiler */
/** @typedef {import("../types").WebpackStatsAsset} WebpackStatsAsset */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WpBuildPluginOptions} WpBuildPluginOptions */


/**
 * @class WpBuildLicenseFilePlugin
 */
class WpBuildLicenseFilePlugin extends WpBuildBasePlugin
{
    /**
     * @function Called by webpack runtime to apply this plugin
     * @param {WebpackCompiler} compiler the compiler instance
     * @returns {void}
     */
    apply(compiler)
    {
        this.onApply(compiler,
        {
            checkin: {
                async: true,
                hook: "shutdown",
                callback: this.licenseFiles.bind(this)
            }
        });
    }

    /**
     * @function licenseFiles
     * @returns {Promise<void>}
     */
    async licenseFiles()
    {
        const distDir = this.compiler.options.output.path || this.compiler.outputPath,
              items = existsSync(distDir) ? await readdir(distDir) : [];
        for (const file of items.filter(i => i.includes("LICENSE")))
        {
            try {
                if (!file.includes(".debug")) {
                    await rename(join(distDir, file), join(distDir, file.replace("js.LICENSE.txt", "LICENSE")));
                }
                else {
                    await unlink(join(distDir, file));
                }
            } catch {}
        }
    };
}


/**
 * @function
 * @param {WpBuildEnvironment} env
 * @returns {WpBuildLicenseFilePlugin | undefined}
 */
const licensefiles = (env) =>
    (env.app.plugins.licensefiles !== false && env.isExtensionProd ? new WpBuildLicenseFilePlugin({ env }) : undefined);


export default licensefiles;

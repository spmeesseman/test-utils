/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuild.plugin.ignore
 */

import webpack from "webpack";

/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */


/**
 * @param {WpBuildEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {webpack.IgnorePlugin | undefined}
 */
const ignore = (env, wpConfig) =>
{
    /** @type {webpack.IgnorePlugin | undefined} */
    let plugin;
    if (env.app.plugins.ignore !== false && wpConfig.mode === "production")
    {
        plugin = new webpack.IgnorePlugin(
        {
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        });
    }
    return plugin;
};


export default ignore;

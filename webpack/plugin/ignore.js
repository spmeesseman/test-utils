/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.ignore
 */

import webpack from "webpack";

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */

/**
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {webpack.IgnorePlugin | undefined}
 */
const ignore = (env, wpConfig) =>
{
    let plugin;
    if (wpConfig.mode === "production")
    {
        // plugin = new webpack.IgnorePlugin({
        //     resourceRegExp: /^\.\/locale$/,
        //     contextRegExp: /moment$/,
        // });
    }
    return plugin;
};

export default ignore;

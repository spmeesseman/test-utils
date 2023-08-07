/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuild.utils.app
 */

import { resolve, isAbsolute, join } from "path";
import { globalEnv } from "./global";
import gradient from "gradient-string";
import { WebpackError } from "webpack";
import WpBuildConsoleLogger from "./console";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { merge, pickBy, mergeIf, clone } from "./utils";
import { access, readFile, writeFile } from "fs/promises";

/** @typedef {import("../types").WpBuildApp} WpBuildApp */
/** @typedef {import("../types").WebpackMode} WebpackMode */
/** @typedef {import("../types").WpBuildAppRc} WpBuildAppRc */
/** @typedef {import("../types").WpBuildWebpackArgs} WpBuildWebpackArgs */
/** @typedef {import("../types").WebpackCompilation} WebpackCompilation */
/** @typedef {import("../types").WpBuildPackageJson} WpBuildPackageJson */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WebpackVsCodeBuild} WebpackVsCodeBuild */
/** @typedef {import("../types").WpBuildCacheOptions} WpBuildCacheOptions */


/**
 * @class
 */
class WpBuildCache
{
    /**
     * @member
     * @private
     * @type {Record<string, any>}
     */
    cache;

    /**
     * @member
     * @private
     * @type {WpBuildEnvironment}
     */
    env;

    /**
     * @member
     * @protected
     * @type {WpBuildCacheOptions}
     */
    options;


    /**
     * @class WpBuildApplication
     * @param {WpBuildEnvironment} env Webpack build environment
     * @param {WpBuildCacheOptions} options Cache options to apply
     * @throws {WebpackError}
     */
    constructor(env, options)
    {
        this.env = env;
        this.options = merge({}, options);
        if (!isAbsolute(this.options.file)) {
            this.options.file = resolve(this.env.global.cacheDir, options.file);
        }
        this.cache = this.read();
    }


    /**
     * @function
     * @returns {Record<string, any>}
     */
    get = () => merge({}, this.cache);


    /**
     * @function
     * @param {string} item
     * @returns {any}
     */
    getItem = (item) => clone(this.cache[item]);


    /**
     * @function
     * @returns {Record<string, any>}
     */
    read = () =>
    {
        let jso;
        if (!existsSync(this.options.file)) {
            writeFileSync(this.options.file, "{}");
        }
        try {
            jso = JSON.parse(readFileSync(this.options.file, "utf8"));
        }
        catch (e) { jso = {}; }
        return jso;
    };


    /**
     * @function
     */
    save = () => writeFileSync(this.options.file, JSON.stringify(this.cache));


    /**
     * @function
     */
    saveAsync = () => writeFile(this.options.file, JSON.stringify(this.cache));


    /**
     * @function
     * @param {Record<string, any>} cache The cache, as a JSON object
     */
    set = (cache) => { this.cache = merge({}, cache); this.save(); };


    /**
     * @function
     * @param {Record<string, any>} cache The cache, as a JSON object
     */
    setAsync = (cache) => { this.cache = merge({}, cache); return this.saveAsync(); };

}


export default WpBuildCache;

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuildutils.utils
 */

import { resolve } from "path";
import { globalEnv } from "./global";
import gradient from "gradient-string";
import { WebpackError } from "webpack";
import { readFileSync, existsSync } from "fs";
import { write, writeInfo, withColor, figures, colors } from "./console";

/** @typedef {import("../types").WpBuildApp} WpBuildApp */
/** @typedef {import("../types").WebpackMode} WebpackMode */
/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WpBuildWebpackArgs} WpBuildWebpackArgs */
/** @typedef {import("../types").WebpackCompilation} WebpackCompilation */
/** @typedef {import("../types").WpBuildPackageJson} WpBuildPackageJson */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WebpackVsCodeBuild} WebpackVsCodeBuild */


/**
 * @function apply
 * @param {Record<string, any>} object
 * @param {Record<string, any> | undefined} config
 * @param {Record<string, any>} [defaults]
 * @returns {Record<string, any>}
 */
const apply = (object, config, defaults) =>
{
    if (object)
    {
        if (defaults) {
            apply(object, defaults);
        }
        if (config && isObject(config)) {
            Object.keys(config).forEach((i) => { object[i] = config[i]; });
        }
    }
    return object;
};


/**
 * @param v Variable to check to see if it's an array
 * @param [shallow] If `true`, and  `arr` is an array, return a shallow copy
 * @param [allowEmpStr] If `false`, return empty array if isString(v) and isEmpty(v)
 * @returns {any[]}
 */
const asArray = (v, shallow, allowEmpStr) => (isArray(v) ? (shallow !== true ? v : v.slice()) : (!isEmpty(v, allowEmpStr) ? [ v ] : []));


/**
 * @function clone
 * @param {any} item
 * @returns {any}
 */
const clone = (item) =>
{
    if (!item) {
        return item;
    }
    if (isDate(item)) {
        return new Date(item.getTime());
    }
    if (isArray(item))
    {
        let i = item.length;
        const c = [];
        while (i--) { c[i] = clone(item[i]); }
        return c;
    }
    if (isObject(item))
    {
        const c = {};
        Object.keys((item)).forEach((key) =>
        {
            c[key] = clone(item[key]);
        });
        return c;
    }
    return item;
};


/**
 * @function getEntriesRegex
 * @param {WebpackConfig} wpConfig Webpack config object
 * @param {boolean} [dbg]
 * @param {boolean} [ext]
 * @param {boolean} [hash]
 */
const getEntriesRegex = (wpConfig, dbg, ext, hash) =>
{
    return new RegExp(
        `(?:${Object.keys(wpConfig.entry).reduce((e, c) => `${e ? e + "|" : ""}${c}`, "")})` +
        `(?:\\.debug)${!dbg ? "?" : ""}(?:\\.[a-z0-9]{${wpConfig.output.hashDigestLength || 20}})` +
        `${!hash ? "?" : ""}(?:\\.js|\\.js\\.map)${!ext ? "?" : ""}`
    );
};


const isObject = (v, allowArray) => !!v && (v instanceof Object || typeof v === "object") && (allowArray || !isArray(v));


const isArray = (v, allowEmp) => !!v && Array.isArray(v) && (allowEmp !== false || v.length > 0);


const isDate = (v) => !!v && Object.prototype.toString.call(v) === "[object Date]";

/**
 * @param v Variable to check to see if it's an array
 * @param [allowEmpStr] If `true`, return non-empty if isString(v) and v === ""
 * @returns {boolean}
 */
const isEmpty = (v, allowEmpStr) => v === null || v === undefined || (!allowEmpStr ? v === "" : false) || (isArray(v) && v.length === 0) || (isObject(v) && isObjectEmpty(v));


const isObjectEmpty = (v) => { if (v) { return Object.keys(v).filter(k => ({}.hasOwnProperty.call(v, k))).length === 0; } return true; };


const isString = (v, notEmpty) => (!!v || (v === "" && !notEmpty)) && (v instanceof String || typeof v === "string");


/**
 * @function merge
 * @param {...Record<string, any>} destination
 * @returns {Record<string, any>}
 */
const merge = (...destination) =>
{
    const ln = destination.length;
    for (let i = 1; i < ln; i++)
    {
        const object = destination[i];
        Object.keys(object).forEach((key) =>
        {
            const value = object[key];
            if (isObject(value))
            {
                const sourceKey = destination[0][key];
                if (isObject(sourceKey))
                {
                    merge(sourceKey, value);
                }
                else {
                    destination[0][key] = clone(value);
                }
            }
            else {
                destination[0][key] = value;
            }
        });
    }
    return destination[0];
};


/**
 * @function merge
 * @param {...Record<string, any>} destination
 * @returns {any}
 */
const mergeIf = (...destination) =>
{
    const ln = destination.length;
    for (let i = 1; i < ln; i++)
    {
        const object = destination[i];
        for (const key in object)
        {
            if (!(key in destination[0]))
            {
                const value = object[key];
                if (isObject(value))
                {
                    destination[0][key] = clone(value);
                }
                else {
                    destination[0][key] = value;
                }
            }
        }
    }
    return destination[0];
};


const pick = (obj, ...keys) =>
{
    const ret = {};
    keys.forEach(key => { ret[key] = obj[key]; });
    return ret;
};


const pickBy = (obj, pickFn) =>
{
    const ret = {};
    Object.keys(obj).filter(k => pickFn(k)).forEach(key => ret[key] = obj[key]);
    return ret;
};


const pickNot = (obj, ...keys) =>
{
    const ret = apply({}, obj);
    keys.forEach(key => { delete ret[key]; });
    return ret;
};


const printLineSep = () =>
{
    writeInfo("------------------------------------------------------------------------------------------------------------------------");
};


/**
 * @function
 * @param {WpBuildApp} app
 * @param {WebpackMode} mode Webpack command line args
 * @param {Partial<WpBuildEnvironment>} env Webpack build environment
 */
const printBanner = (app, mode, env) =>
{
    printLineSep();
    // console.log(gradient.rainbow(spmBanner(version), {interpolation: "hsv"}));
    console.log(gradient("red", "cyan", "pink", "green", "purple", "blue").multiline(spmBanner(app.displayName, app.version), {interpolation: "hsv"}));
    printLineSep();
    write(gradient("purple", "blue", "pink", "green", "purple", "blue").multiline(` Start ${app.bannerNameDetailed} Webpack Build`));
    printLineSep();
	write(withColor("   Mode  : ", colors.white) + withColor(mode, colors.grey));
	write(withColor("   Argv  : ", colors.white) + withColor(JSON.stringify(env.argv), colors.grey));
	write(withColor("   Env   : ", colors.white) + withColor(JSON.stringify(env), colors.grey));
    printLineSep();
};


/**
 * @function
 * @throws {WebpackError}
 * @returns {WpBuildApp}
 */
const readConfigFiles = () =>
{
    /** @type {WpBuildApp} */
    const appRc = {},
          rcPath = resolve(__dirname, "..", ".wpbuildrc.json"),
          pkgJsonPath = resolve(__dirname, "..", "..", "package.json");
    //
    // Read .wpbuildrc
    //
    try
    {   if (existsSync(rcPath))
        {
            merge(appRc, JSON.parse(readFileSync(rcPath, "utf8")));
        }
        else {
            throw new WebpackError("Could not locate .wpbuildrc.json");
        }
    }
    catch {
        throw new WebpackError("Could not parse .wpbuildrc.json, check syntax");
    }

    //
    // Read package.json
    //
    try
    {   if (existsSync(pkgJsonPath))
        {
            const props = [ // needs to be in sync with the properties of `WpBuildPackageJson`
                "author", "displayName", "name", "description", "main", "module", "publisher", "version"
            ];
            /** @type {WpBuildPackageJson} */
            const pkgJso = JSON.parse(readFileSync(pkgJsonPath, "utf8")),
                  pkgJsoPartial = pickBy(pkgJso, p => props.includes(p));
            merge(appRc, {}, { pkgJson: pkgJsoPartial });
            merge(globalEnv, {}, { pkgJson: pkgJsoPartial });
        }
        else {
            throw new WebpackError("Could not locate package.json");
        }
    }
    catch {
        throw new WebpackError("Could not parse package.json, check syntax");
    }

    if (!appRc.plugins) {
        appRc.plugins = {};
    }

    if (!appRc.exports) {
        appRc.exports = {};
    }

    //
    // PRIMITIVE PROPERTIES
    //
    if (!appRc.name) {
        appRc.name = appRc.pkgJson.name;
    }
    if (!appRc.displayName) {
        appRc.name = appRc.pkgJson.displayName;
    }
    if (!appRc.bannerName) {
        appRc.bannerName = appRc.displayName;
    }
    if (!appRc.bannerNameDetailed) {
        appRc.bannerNameDetailed = appRc.bannerName;
    }
    if (!appRc.version) {
        appRc.version = appRc.pkgJson.version;
    }

    //
    // VSCODE PROPERTIES
    //
    if (!appRc.vscode) {
        appRc.vscode = /** @type {WebpackVsCodeBuild} */({});
    }
    mergeIf(appRc.vscode, { webview: { apps: {}, baseDIr: "" }});
    mergeIf(appRc.vscode.webview, { apps: {}, baseDir: "" });

    //
    // LOGPAD PROPERTIES
    //
    if (!appRc.logPad) {
        appRc.logPad = { plugin: {}, externals: {} };
    }
    if (!appRc.logPad.externals) {
        appRc.logPad.externals = {};
    }
    if (!appRc.logPad.plugin) {
        appRc.logPad.plugin = {};
    }
    mergeIf(appRc.logPad.plugin,
    {
        compilation: 20,
        loghooks: {
            buildTag: 23
        },
        upload: {
            fileList: 45
        }
    });

    return appRc;
};


// /**
//  * @function
//  * @param {string} app Application name
//  * @param {string} version Application version
//  * @returns {string}
//  */
// const spmBanner2 = (app, version) =>
// {
//     return `     ${figures.info}       ___ ___ _/\\ ___  __ _/^\\_ __  _ __  __________________
//      ${figures.info}      (   ) _ \\|  \\/  |/  _^ || '_ \\| '_ \\(  ______________  )
//      ${figures.info}      \\ (| |_) | |\\/| (  (_| || |_) ) |_) )\\ \\          /\\/ /
//      ${figures.info}    ___)  ) __/|_|  | ^/\\__\\__| /__/| /__/__) ) Version \\  /
//      ${figures.info}   (_____/|_|       | /       |_|   |_| (____/   ${version}   \\/
//      ${figures.info}                    |/${app.padStart(51 - app.length)}`;
// };


/**
 * @function
 * @param {string} app Application name
 * @param {string} version Application version
 * @returns {string}
 */
const spmBanner = (app, version) =>
{
    return `     ${figures.info}       ___ ___ _/\\ ___  __ _/^\\_ __  _ __  __________________   ____/^\\.  __//\\.____ __   ____  _____
     ${figures.info}      (   ) _ \\|  \\/  |/  _^ || '_ \\| '_ \\(  ______________  ) /  _^ | | / //\\ /  __\\:(  // __\\// ___)
     ${figures.info}      \\ (| |_) | |\\/| (  (_| || |_) ) |_) )\\ \\          /\\/ / (  (_| | |/ /|_| | ___/\\\\ // ___/| //
     ${figures.info}    ___)  ) __/|_|  | ^/\\__\\__| /__/| /__/__) ) Version \\  / /^\\__\\__| |\\ \\--._/\\____ \\\\/\\\\___ |_|
     ${figures.info}   (_____/|_|       | /       |_|   |_| (____/   ${version}  \\/ /        |/  \\:(           \\/           
     ${figures.info}                    |/${app.padStart(50 - app.length)}`;
};


export {
    apply, asArray, clone, isArray, isDate, isEmpty, isObject, isObjectEmpty, isString,
    printLineSep, getEntriesRegex, merge, mergeIf, pick, pickBy, pickNot, printBanner, readConfigFiles
};

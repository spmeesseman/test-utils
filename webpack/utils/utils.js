/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

import globalEnv from "./global";
import { resolve } from "path";
const gradient = require("gradient-string");
import { WebpackError } from "webpack";
import { readFileSync, existsSync } from "fs";
import { write, writeInfo, withColor, figures, colors } from "./console";

/** @typedef {import("../types").IWebpackApp} IWebpackApp */
/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").IWebpackPackageJson} IWebpackPackageJson */


/**
 * @function apply
 * @param {Record<string, any>} object
 * @param {Record<string, any>} config
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
        if (isObject(config)) {
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
 */
const getEntriesRegex = (wpConfig) =>
{
	return `(?:${Object.keys(wpConfig.entry).reduce((e, c) => `${!!e ? `${e}|` : e}${c}`, "")})`;
};


/**
 * @function initGlobalEnvObject
 * @param {string} baseProp
 * @param {any} [initialValue]
 * @param {...any} props
 */
const initGlobalEnvObject = (baseProp, initialValue, ...props) =>
{
    if (!globalEnv[baseProp]) {
        globalEnv[baseProp] = {};
    }
    props.filter(p => !globalEnv[baseProp][p]).forEach((p) => { globalEnv[baseProp][p] = initialValue; });
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


const printBanner = (app, appDetailName, version, mode, env, argv) =>
{
    printLineSep();
    // console.log(gradient.rainbow(spmBanner(version), {interpolation: "hsv"}));
    console.log(gradient("red", "cyan", "pink", "green", "purple", "blue").multiline(spmBanner(app, version), {interpolation: "hsv"}));
    printLineSep();
    write(gradient("purple", "blue", "pink", "green", "purple", "blue").multiline(` Start ${appDetailName} Webpack Build`));
    printLineSep();
	write(withColor("   Mode  : ", colors.white) + withColor(mode, colors.grey));
	write(withColor("   Argv  : ", colors.white) + withColor(JSON.stringify(argv), colors.grey));
	write(withColor("   Env   : ", colors.white) + withColor(JSON.stringify(env), colors.grey));
    printLineSep();
};


/**
 * @function
 * @throws {WebpackError}
 * @returns {IWebpackApp}
 */
const readConfigFiles = () =>
{
    /** @type {IWebpackApp} */
    const appRc = {},
          rcPath = resolve(__dirname, "..", ".wpbuildrc.json"),
          pkgJsonPath = resolve(__dirname, "..", "..", "package.json");

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

    try
    {   if (existsSync(pkgJsonPath))
        {
            const props = [ // needs to be in sync with the properties of `IWebpackPackageJson`
                "author", "displayName", "name", "description", "main", "module", "publisher", "version"
            ];
            /** @type {IWebpackPackageJson} */
            const pkgJso = JSON.parse(readFileSync(pkgJsonPath, "utf8")),
                  pkgJsoPartial = pickBy(pkgJso, p => props.includes(p));
            merge(appRc, { pkgJson: { ...pkgJsoPartial }});
            merge(globalEnv, { pkgJson: { ...pkgJsoPartial }});
        }
        else {
            throw new WebpackError("Could not locate package.json");
        }
    }
    catch {
        throw new WebpackError("Could not parse package.json, check syntax");
    }

    if (!appRc.name) {
        appRc.name = appRc.pkgJson.name;
    }

    if (!appRc.nameDetail) {
        appRc.nameDetail = appRc.name;
    }

    if (!appRc.vscode) {
        appRc.vscode = {};
    }

    if (!appRc.vscode.webview) {
        appRc.vscode.webview = {};
    }

    if (!appRc.name) {
        appRc.version = appRc.pkgJson.version;
    }

    return appRc;
};


/**
 * @function
 * @param {string} app Application name
 * @param {string} version Application version
 * @returns {string}
 */
const spmBanner = (app, version) =>
{
    return `     ${figures.info}       ___ ___ _/\\  ___  __ _/^\\_ __  _ __  __________________
     ${figures.info}      (   ) _ \\|  \\/  | /  _^ || '_ \\| '_ \\(  ______________  )
     ${figures.info}      \\ (| |_) | |\\/| |(  (_| || |_) ) |_) )\\ \\          /\\/ /
     ${figures.info}    ___)  ) __/|_|  | '/^\\__\\__| /__/| /__/__) ) Version \\  /
     ${figures.info}   (_____/|_|       | /        |_|   |_| (____/   ${version}   \\/
     ${figures.info}                    |/${app.padStart(51 - app.length)}`;
};


export {
    apply, asArray, clone, isArray, isDate, isEmpty, isObject, isObjectEmpty, printLineSep, getEntriesRegex,
    initGlobalEnvObject, merge, mergeIf, pick, pickBy, pickNot, printBanner, readConfigFiles, spmBanner
};

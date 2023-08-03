/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuild.utils.utils
 */

/** @typedef {import("../types").WpBuildApp} WpBuildApp */
/** @typedef {import("../types").WebpackMode} WebpackMode */
/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WpBuildWebpackArgs} WpBuildWebpackArgs */
/** @typedef {import("../types").WebpackCompilation} WebpackCompilation */
/** @typedef {import("../types").WpBuildPackageJson} WpBuildPackageJson */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WebpackVsCodeBuild} WebpackVsCodeBuild */

/**
 * @function
 * @template {Record<string, any>} [T=Record<string, any>]
 * @param {Record<string, any>} object
 * @param {Record<string, any> | undefined} config
 * @param {Record<string, any>} [defaults]
 * @returns {T}
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
    return /** @type {T} */(object);
};


/**
 * @template T
 * @param {T | Set<T> | Array<T>} v Variable to check to see if it's an array
 * @param {boolean} [shallow] If `true`, and  `arr` is an array, return a shallow copy
 * @param {boolean} [allowEmpStr] If `false`, return empty array if isString(v) and isEmpty(v)
 * @returns {Array<NonNullable<T>>}
 */
const asArray = (v, shallow, allowEmpStr) => /** @type {Array} */((v instanceof Set ? Array.from(v): (isArray(v) ? (shallow !== true ? v : v.slice()) : (!isEmpty(v, allowEmpStr) ? [ v ] : []))));


/**
 * @function
 * @template T
 * @param {any} item
 * @returns {T}
 */
const clone = (item) =>
{
    if (!item) {
        return item;
    }
    if (isDate(item)) {
        return /** @type {T} */(new Date(item.getTime()));
    }
    if (isArray(item))
    {
        let i = item.length;
        const c = [];
        while (i--) { c[i] = clone(item[i]); }
        return /** @type {T} */(c);
    }
    if (isObject(item))
    {
        const c = {};
        Object.keys((item)).forEach((key) =>
        {
            c[key] = clone(item[key]);
        });
        return /** @type {T} */(c);
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


/**
 * @template {{}} [T=Record<string, any>]
 * @param {T | undefined} v Variable to check to see if it's an array
 * @param {boolean} [allowArray] If `true`, return true if v is an array
 * @returns {v is T}
 */
const isObject = (v, allowArray) => !!v && (v instanceof Object || typeof v === "object") && (allowArray || !isArray(v));


/**
 * @param {any} v Variable to check to see if it's an array
 * @param {boolean} [allowEmp] If `true`, return true if v is an empty array
 * @returns {v is []}
 */
const isArray = (v, allowEmp) => !!v && Array.isArray(v) && (allowEmp !== false || v.length > 0);


const isDate = (v) => !!v && Object.prototype.toString.call(v) === "[object Date]";

/**
 * @param {any} v Variable to check to see if it's an array
 * @param {boolean} [allowEmpStr] If `true`, return non-empty if isString(v) and v === ""
 * @returns {v is null | undefined | "" | []}
 */
const isEmpty = (v, allowEmpStr) => v === null || v === undefined || (!allowEmpStr ? v === "" : false) || (isArray(v) && v.length === 0) || (isObject(v) && isObjectEmpty(v));


const isObjectEmpty = (v) => { if (v) { return Object.keys(v).filter(k => ({}.hasOwnProperty.call(v, k))).length === 0; } return true; };


/**
 * @param {any} v Variable to check to see if it's an array
 * @param {boolean} [notEmpty] If `false`, return false if v is a string of 0-length
 * @returns {v is string}
 */
const isString = (v, notEmpty) => (!!v || (v === "" && !notEmpty)) && (v instanceof String || typeof v === "string");


/**
 * @function
 * @template {{}} [T=Record<string, any>]
 * @param {...(Partial<T>)} destination
 * @returns {T}
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
    return /** @type {T} */(destination[0]);
};


/**
 * @function
 * @template {{}} [T=Record<string, any>]
 * @param {...(Partial<T>)} destination
 * @returns {T}
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
                const value = /** @type {Partial<T>} */(object[key]);
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
    return /** @type {T} */(destination[0]);
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


export {
    apply, asArray, clone, isArray, isDate, isEmpty, isObject, isObjectEmpty, isString,
    getEntriesRegex, merge, mergeIf, pick, pickBy, pickNot
};

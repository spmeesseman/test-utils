/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

import WpBuildCache from "./cache";
import { globalEnv } from "./global";
import WpBuildApplication from "./app";
const app = WpBuildApplication; // alias WpBuildApplication
import environment from "./environment";
import WpBuildConsoleLogger from "./console";
import {
    apply, asArray, clone, getTsConfig, merge, mergeIf, isArray, isDate, isEmpty, isFunction,
    isObject, isObjectEmpty, isPrimitive, isPromise, isString, pick, pickBy, pickNot, findFiles
} from "./utils";

export {
    app, apply, asArray, clone, environment, findFiles, getTsConfig, globalEnv, isArray, isDate,
    isEmpty, isFunction, isObject, isObjectEmpty, isPrimitive, isPromise, isString, merge, mergeIf,
    pick, pickBy, pickNot, WpBuildCache, WpBuildConsoleLogger
};

/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

import { globalEnv } from "./global";
import WpBuildApplication from "./app";
const app = WpBuildApplication; // alias WpBuildApplication
import environment from "./environment";
import WpBuildConsoleLogger from "./console";
import {
    apply, asArray, clone, merge, mergeIf, isArray, isDate, isEmpty, isObject, isObjectEmpty,
    isString, getEntriesRegex, pick, pickBy, pickNot, findFiles
} from "./utils";

export {
    app, apply, asArray, clone, environment, findFiles, getEntriesRegex, globalEnv, isArray, isDate, isEmpty,
    isObject, isObjectEmpty, isString, merge, mergeIf, pick, pickBy, pickNot, WpBuildConsoleLogger
};

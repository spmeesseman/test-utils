// @ts-check

import { resolve, join } from "path";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "fs";

/**
 * @module wpbuild.utils.global
 */

/** @typedef {import("../types").WpBuildPackageJson} WpBuildPackageJson */
/** @typedef {import("../types").WpBuildGlobalEnvironment} WpBuildGlobalEnvironment */



const cacheDir = resolve(__dirname, "..", "..", "node_modules", ".cache", "wpbuild");
if (!existsSync(cacheDir)) { mkdirSync(cacheDir, { recursive: true }); }

const globalCacheFilePath = join(cacheDir, "global.json");
if (!existsSync(globalCacheFilePath)) { writeFileSync(globalCacheFilePath, "{}"); }


/** @type {WpBuildGlobalEnvironment} */
const globalEnv = {
    buildCount: 0,
    cache: JSON.parse(readFileSync(globalCacheFilePath, "utf8")),
    cacheDir,
    verbose: false,
    pkgJson: /** @type {WpBuildPackageJson} */({})
};


export { globalEnv };

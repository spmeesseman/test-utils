// @ts-check

import analyze from "./analyze";
import asset from "./asset";
import banner from "./banner";
import build from "./build";
import clean from "./clean";
import compile from "./compile";
import copy from "./copy";
import finalize from "./finalize";
import { hash, prehash } from "./hash";
import ignore from "./ignore";
import optimization from "./optimization";
import loghooks from "./loghooks";
import progress from "./progress";
import scm from "./scm";
import sourcemaps from "./sourcemaps";
import tscheck from "./tscheck";
import upload from "./upload";
import { cssextract, htmlcsp, imageminimizer, htmlinlinechunks, webviewapps } from "./html";

export {
    analyze,
    asset,
    banner,
    build,
    clean,
    compile,
    copy,
    cssextract,
    finalize,
    hash,
    htmlcsp,
    htmlinlinechunks,
	ignore,
    imageminimizer,
    loghooks,
    optimization,
    prehash,
    progress,
    scm,
    sourcemaps,
    tscheck,
    upload,
    webviewapps
};

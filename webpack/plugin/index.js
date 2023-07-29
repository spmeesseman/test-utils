// @ts-check

import analyze from "./analyze";
import banner from "./banner";
import build from "./build";
import clean from "./clean";
import compilation from "./compilation";
import copy from "./copy";
import finalize from "./finalize";
import { hash, prehash } from "./hash";
import ignore from "./ignore";
import instrument from "./instrument";
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
    banner,
    build,
    clean,
    compilation,
    copy,
    cssextract,
    finalize,
    hash,
    htmlcsp,
    htmlinlinechunks,
	ignore,
    imageminimizer,
    instrument,
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

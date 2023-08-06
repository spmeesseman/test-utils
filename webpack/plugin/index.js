// @ts-check

import analyze from "./analyze";
import banner from "./banner";
import clean from "./clean";
import copy from "./copy";
import dispose from "./dispose";
import runtimevars from "./runtimevars";
import environment from "./environment";
import istanbul from "./istanbul";
import licensefiles from "./licensefiles";
import ignore from "./ignore";
import instrument from "./instrument";
import optimization from "./optimization";
import loghooks from "./loghooks";
import progress from "./progress";
import scm from "./scm";
import sourcemaps from "./sourcemaps";
import testsuite from "./testsuite";
import tscheck from "./tscheck";
import upload from "./upload";
import vendormod from "./vendormod";
import { cssextract, htmlcsp, imageminimizer, htmlinlinechunks, webviewapps } from "./html";

export {
    analyze, banner, clean, copy, cssextract, dispose, environment, htmlcsp, htmlinlinechunks,
    ignore, imageminimizer, instrument, istanbul, licensefiles, loghooks, optimization,
    progress, runtimevars, scm, sourcemaps, testsuite, tscheck, upload, vendormod, webviewapps
};

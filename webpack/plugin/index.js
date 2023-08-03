// @ts-check

import analyze from "./analyze";
import banner from "./banner";
import build from "./build";
import clean from "./clean";
import compile from "./compile";
import copy from "./copy";
import customize from "./customize";
import runtimevars from "./runtimevars";
import environment from "./environment";
import licensefiles from "./licensefiles";
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
    analyze, banner, build, clean, compile, copy, cssextract, customize, environment,
    htmlcsp, htmlinlinechunks,ignore, imageminimizer, instrument, licensefiles, loghooks,
    optimization, progress, runtimevars, scm, sourcemaps, tscheck, upload, webviewapps
};

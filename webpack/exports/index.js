// @ts-check

const context = require("./context");
const devtool = require("./devtool");
const entry = require("./entry");
const environment = require("./environment");
const externals = require("./externals");
const ignorewarnings = require("./ignorewarnings");
const minification = require("./minification");
const { mode, getMode } = require("./mode");
const name = require("./name");
const optimization = require("./optimization");
const plugins = require("./plugins");
const output = require("./output");
const resolve = require("./resolve");
const rules = require("./rules");
const stats = require("./stats");
const target = require("./target");
const watch = require("./watch");

export default {
    context,
    devtool,
	entry,
    environment,
    externals,
    getMode,
    ignorewarnings,
    minification,
    mode,
    name,
    optimization,
    plugins,
    output,
    resolve,
    rules,
    stats,
    target,
    watch
};

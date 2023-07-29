/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

import globalEnv from "../utils/global";
import { initGlobalEnvObject } from "../utils/utils";
import { writeInfo, withColor, figures, colors, withColorLength } from "../utils/console";

/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WebpackCompiler} WebpackCompiler */
/** @typedef {import("../types").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @function addStepHook
 * @param {string} hook
 * @param {WebpackPluginInstance[]} plugins
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const addStepHook = (hook, plugins, env, wpConfig) =>
{
	plugins.push({
		apply: (compiler) =>
		{
			compiler.hooks[hook].tap(`${hook}LogHookPlugin`, () => writeBuildTag(hook, env, wpConfig));
		}
	});
};


/**
 * @function addStepHook
 * @param {string} hook
 * @param {WebpackPluginInstance[]} plugins
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const addStepHookPromise = (hook, plugins, env, wpConfig) =>
{
	plugins.push({
		apply: (compiler) =>
		{
			compiler.hooks[hook].tapPromise(`${hook}LogHookPromisePlugin`, async () => writeBuildTag(hook, env, wpConfig));
		}
	});
};


/**
 * @function hookSteps
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {WebpackPluginInstance[]}
 */
const hookSteps = (env, wpConfig) =>
{
	/** @type {WebpackPluginInstance[]} */
	const plugins = [];
	if (env.app.plugins.loghooks)
	{
		initGlobalEnvObject("hooksLog");
		addStepHook("environment", plugins, env, wpConfig);
		addStepHook("afterEnvironment", plugins, env, wpConfig);
		addStepHook("entryOption", plugins, env, wpConfig);
		addStepHook("afterPlugins", plugins, env, wpConfig);
		addStepHook("afterResolvers", plugins, env, wpConfig);
		addStepHook("initialize", plugins, env, wpConfig);
		addStepHook("beforeRun", plugins, env, wpConfig);
		addStepHook("run", plugins, env, wpConfig);
		addStepHook("watchRun", plugins, env, wpConfig);
		addStepHook("normalModuleFactory", plugins, env, wpConfig);
		addStepHook("contextModuleFactory", plugins, env, wpConfig);
		addStepHook("beforeCompile", plugins, env, wpConfig);
		addStepHook("compile", plugins, env, wpConfig);
		addStepHook("thisCompilation", plugins, env, wpConfig);
		addStepHook("compilation", plugins, env, wpConfig);
		addStepHook("make", plugins, env, wpConfig);
		addStepHook("afterCompile", plugins, env, wpConfig);
		addStepHook("shouldEmit", plugins, env, wpConfig);
		addStepHook("emit", plugins, env, wpConfig);
		addStepHook("afterEmit", plugins, env, wpConfig);
		addStepHookPromise("assetEmitted", plugins, env, wpConfig);
		addStepHook("emit", plugins, env, wpConfig);
		addStepHook("done", plugins, env, wpConfig);
		addStepHook("afterDone", plugins, env, wpConfig);
		addStepHook("additionalPass", plugins, env, wpConfig);
		addStepHook("failed", plugins, env, wpConfig);
		addStepHook("invalid", plugins, env, wpConfig);
		addStepHook("watchClose", plugins, env, wpConfig);
		addStepHook("shutdown", plugins, env, wpConfig);
	}
	return plugins;
};


/**
 * @function writeBuildTag
 * @param {string} hook
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const writeBuildTag = (hook, env, wpConfig) =>
{
	const key = hook + wpConfig.name;
	if (!globalEnv.hooksLog[key])
	{
		globalEnv.hooksLog[key] = true;
		const hookName = `${withColor(figures.star, colors.cyan)} ${hook} ${withColor(figures.star, colors.cyan)}`;
		writeInfo(`[${withColor(env.build, colors.italic)}][${withColor(env.buildMode, colors.italic)}]`
				  .padEnd(env.app.logPad.plugin.loghooks.buildTag + (withColorLength(colors.italic) * 2)) + hookName);
	}
};


export default hookSteps;

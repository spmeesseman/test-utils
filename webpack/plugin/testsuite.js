/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.build
 */

import { join } from "path";
// import webpack from "webpack";
// const { sources } = require("webpack");
import { spawnSync } from "child_process";
import { existsSync, unlinkSync } from "fs";
// const ContextMapPlugin = require("context-map-webpack-plugin");

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types/webpack").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {WebpackPluginInstance[]}
 */
const build = (env, wpConfig) =>
{
	const _env = { ...env };

	const plugins = [
	{   /** @param {import("webpack").Compiler} compiler Compiler */
		apply: (compiler) =>
		{
			compiler.hooks.beforeCompile.tap("BeforeCompilePlugin", () =>
			{
				const isTestsBuild = (_env.build === "tests" || _env.environment.startsWith("test"));
				try {
					tsc.buildTypes(_env);
					if (isTestsBuild) {
						tsc.buildTests(_env);
					}
				} catch {}
			});
		}
	}];

	// plugins.push(
	// 	new webpack.DefinePlugin({
    //         __REQUIRE_MODULE__: env.environment === "dev" ? "" : "require",
    //     })
	// );

	// plugins.push(
	// 	new ContextMapPlugin("node_modules/nyc/lib", [
	// 		"../lib/register-env.js",
	// 		"../lib/wrap.js",
	// 		"../bin/wrap.js"
	// 	])
	// );
	// lugins.push(
	// 	new webpack.ContextReplacementPlugin(
	// 		/(.*)/,
	// 		(resource) =>
	// 		{
	// 			console.log("--------------------------------------------------");
	// 			console.log("ctx: " + resource.context);
	// 			console.log("req: " + resource.request);
	// 			console.log(resource.recursive);
	// 			console.log(resource.resolveOptions);
	// 			console.log(resource.contextInfo);
	// 			console.log("mode: " + resource.mode);
	// 			console.log(resource.resource);
	// 			console.log(resource.request);
	// 			resource.request = resource.request.replace(
	// 				/\./,
	// 				"../.."
	// 			);
	// 			// resource.context = resource.context.replace(
	// 			// 	/src[\/\\]runner/,
	// 			// 	"node_modules\\nyc\\lib"
	// 			// );
	// 			// resource.recursive = false;
	// 		}
	// 	)
	// ;
		// {
		// 	test: /clean\-webpack\-plugin\.js$/,
		// 	include: path.join(env.buildPath, "node_modules", "clean-webpack-plugin", "dist"),
		// 	loader: "string-replace-loader",
		// 	options: {
		// 		multiple: [
		// 		{
		// 			search: "hooks.emit.tap('clean-webpack-plugin', compilation => {",
		// 			replace: "hooks.beforeCompile.tap('clean-webpack-plugin', compilation => {"
		// 		},
		// 		{
		// 			search: "const stats = compilation.getStats();",
		// 			replace: "this.removeFiles(this.cleanOnceBeforeBuildPatterns); return;"
		// 		}]
		// 	}
		// },
/*
	plugins.push(
		new webpack.ContextReplacementPlugin(/(.*)/, (context) =>
		{
			console.log(context.context);
			Object.keys(context).forEach(k => console.log(k));
			if (!/[\/\\]runner/.test(context.context)) {
				return;
			}
			Object.assign(context,
			{
				regExp: /^\w+/,
				request: "../../node_modules/nyc/lib", // resolved relatively
			});
		})
	);
*/
	// plugins.push(
	// {
	// 	/** @param {import("webpack").Compiler} compiler Compiler */
	// 	apply: (compiler) =>
	// 	{
	// 		compiler.hooks.compilation.tap("CompilationPlugin", (compilation) =>
	// 		{
	// 			compilation.hooks.afterProcessAssets.tap(
	// 			{
	// 				name: "CompilationPlugin",
	// 				stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
	// 			},
	// 			 (assets) =>
	// 			{
	// 				Object.keys(assets).forEach(k => console.log("" + k));
	// 				const oldSource = assets["testutils.cjs"];
	// 				const { ReplaceSource } = compiler.webpack.sources;
	// 				const newSource = new ReplaceSource(oldSource, "CompilationPlugin");
	// 				const codeToReplace = "require(",
	// 					  newCode = "__non_webpack_require__(",
	// 					  start = oldSource.source().indexOf(codeToReplace),
	// 					  end = start + codeToReplace.length;
	// 				newSource.replace(start, end, newCode, "CompilationPlugin");
	// 				compilation.updateAsset("testutils.cjs", newSource);
	// 			});
	// 			// try {
	// 			// 	const outFile = path.join(env.buildPath, "dist", "testutils.cjs");
	// 			// 	if (fs.existsSync(outFile))
	// 			// 	{
	// 			// 		console.log("HHHHHHHHH");
	// 			// 		const regex = /^require\(/mg,
	// 			// 			  content = fs.readFileSync(outFile, "utf8").replace(regex, (v) => { console.log("here"); return "__non_webpack_require__("; });
	// 			// 		fs.writeFileSync(outFile, content);
	// 			// 	}
	// 			// } catch {}
	// 		});
	// 	}
	// });
	return plugins;
};


const tsc =
{
	/**
	 * @param {WebpackEnvironment} env
	 * @returns {void}
	 */
	buildTests: (env) =>
	{
		// const tscArgs = [ "tsc", "-p", "./src/test/tsconfig.json" ];
		// spawnSync("npx", tscArgs, { cwd: env.buildPath, encoding: "utf8", shell: true });
		const npmArgs = [ "npm", "run", "build-tests" ];
		spawnSync("npx", npmArgs, { cwd: env.buildPath, encoding: "utf8", shell: true });
	},

	/**
	 * @param {WebpackEnvironment} env
	 * @returns {void}
	 */
	buildTypes: (env) =>
	{
		const npmArgs = [ "npm", "run", "build-types" ];
		if (!existsSync(join(env.buildPath, "dist", "types"))) {
			try { unlinkSync(join(env.buildPath, "node_modules", ".cache", "tsconfig.tsbuildinfo")); } catch {}
		}
		// const result =
			spawnSync("npx", npmArgs, { cwd: env.buildPath, encoding: "utf8", shell: true });
		// if (result.status !== 0) {
		// 	compilation.warnings.push(/** @type {*}*/(new webpack.WebpackError(paths.join(" -> "))));
		// }
	}

};


export default build;

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.build
 */

const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types/webpack").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {WebpackPluginInstance | undefined}
 */
const build = (env, wpConfig) =>
{
	const _env = { ...env };
	const plugin =
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
	};
	// const plugin =
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
	// 				const oldSource = assets["testutils.js"];
	// 				const { ReplaceSource } = compiler.webpack.sources;
	// 				const newSource = new ReplaceSource(oldSource, "CompilationPlugin");
	// 				const codeToReplace = "require(",
	// 					  newCode = "__non_webpack_require__(",
	// 					  start = oldSource.source().indexOf(codeToReplace),
	// 					  end = start + codeToReplace.length;
	// 				newSource.replace(start, end, newCode, "CompilationPlugin");
	// 				compilation.updateAsset("testutils.js", newSource);
	// 			});
	// 			// try {
	// 			// 	const outFile = path.join(env.buildPath, "dist", "testutils.js");
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
	// };
	return plugin;
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
		const npmArgs = [ "npm", "run", "build-test-suite" ];
		spawnSync("npx", npmArgs, { cwd: env.buildPath, encoding: "utf8", shell: true });
	},

	/**
	 * @param {WebpackEnvironment} env
	 * @returns {void}
	 */
	buildTypes: (env) =>
	{
		const tscArgs = [  "tsc", "-p", "./" ];
		if (!fs.existsSync(path.join(env.buildPath, "dist", "types"))) {
			try { fs.unlinkSync(path.join(env.buildPath, "node_modules", ".cache", "tsconfig.tsbuildinfo")); } catch {}
		}
		spawnSync("npx", tscArgs, { cwd: env.buildPath, encoding: "utf8", shell: true });
	}

};


module.exports = build;

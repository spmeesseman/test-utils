/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const { sources } = require("webpack");
const { spawnSync } = require("child_process");
const CopyPlugin = require("copy-webpack-plugin");
// @ts-ignore
const VisualizerPlugin = require("webpack-visualizer-plugin2");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// const TerserPlugin = require("terser-webpack-plugin");
// const ShebangPlugin = require("webpack-shebang-plugin");
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types/webpack").WebpackPluginInstance} WebpackPluginInstance */

const colors = {
	white: [ 37, 39 ],
	grey: [ 90, 39 ],
	blue: [ 34, 39 ],
	cyan: [ 36, 39 ],
	green: [ 32, 39 ],
	magenta: [ 35, 39 ],
	red: [ 31, 39 ],
	yellow: [ 33, 39 ]
};

/**
 * @param {String} msg
 * @param {Number[]} color Webpack config object
 */
const withColor = (msg, color) => "\x1B[" + color[0] + "m" + msg + "\x1B[" + color[1] + "m";


const wpPlugin =
{
	analyze:
	{
		/**
		 * @param {WebpackEnvironment} env
		 * @param {WebpackConfig} wpConfig Webpack config object
		 * @returns {BundleAnalyzerPlugin | undefined}
		 */
		// @ts-ignore
		bundle: (env, wpConfig) =>
		{
			let plugin;
			if (env.analyze === true)
			{
				plugin = new BundleAnalyzerPlugin({
					analyzerPort: "auto",
					analyzerMode: "static",
					generateStatsFile: true,
					statsFilename: "../.coverage/analyzer-stats.json",
					reportFilename: "../.coverage/analyzer.html",
					openAnalyzer: true
				});
			}
			return plugin;
		},

		/**
		 * @param {WebpackEnvironment} env
		 * @param {WebpackConfig} wpConfig Webpack config object
		 * @returns {CircularDependencyPlugin | undefined}
		 */
		// @ts-ignore
		circular: (env, wpConfig) =>
		{
			let plugin;
			if (env.analyze === true)
			{
				plugin = new CircularDependencyPlugin(
				{
					cwd: env.buildPath,
					exclude: /node_modules/,
					failOnError: false,
					onDetected: ({ module: _webpackModuleRecord, paths, compilation }) =>
					{
						compilation.warnings.push(/** @type {*}*/(new webpack.WebpackError(paths.join(" -> "))));
					}
				});
			}
			return plugin;
		},

		/**
		 * @param {WebpackEnvironment} env
		 * @param {WebpackConfig} wpConfig Webpack config object
		 * @returns {VisualizerPlugin | undefined}
		 */
		// @ts-ignore
		visualizer: (env, wpConfig) =>
		{
			let plugin;
			if (env.analyze === true) {
				plugin = new VisualizerPlugin({ filename: "../.coverage/visualizer.html" });
			}
			return /** @type {VisualizerPlugin | undefined}) */(plugin);
		}
	},


	// babel:
	// {
	// 	/**
	// 	 * @param {WebpackEnvironment} env
	// 	 * @returns {void}
	// 	 */
	// 	buildTests: (env) =>
	// 	{
	// 		// let babel = [
	// 		// 	"babel", "./src/test/suite", "--out-dir", "./dist/test/suite", "--extensions", ".ts",
	// 		// 	"--presets=@babel/preset-env,@babel/preset-typescript",
	// 		// ];
	// 		// spawnSync("npx", babel, { cwd: env.buildPath, encoding: "utf8", shell: true });
	// 		// babel = [
	// 		// 	"babel", "./src/test/run", "--out-dir", "./dist/test/run", "--extensions", ".ts",
	// 		// 	"--presets=@babel/preset-env,@babel/preset-typescript",
	// 		// ];
	// 		// spawnSync("npx", babel, { cwd: env.buildPath, encoding: "utf8", shell: true });
	// 		const babel = [
	// 			"babel", "./src/test", "--out-dir", "./dist/test", "--extensions", ".ts",
	// 			"--presets=@babel/preset-env,@babel/preset-typescript",
	// 		];
	// 		spawnSync("npx", babel, { cwd: env.buildPath, encoding: "utf8", shell: true });
	// 	}
	// },


	/**
	 * @param {WebpackEnvironment} env
	 * @param {WebpackConfig} wpConfig Webpack config object
	 * @returns {webpack.BannerPlugin | undefined}
	 */
	// @ts-ignore
	banner: (env, wpConfig) =>
	{
		let plugin;
		if (wpConfig.mode === "production")
		{
			plugin = new webpack.BannerPlugin(
			{
				banner: `Copyright ${(new Date()).getFullYear()} Scott P Meesseman`,
				entryOnly: true,
				test: /testutils\.js/
				// raw: true
			});
		}
		return plugin;
	},


	/**
	 * @param {WebpackEnvironment} env
	 * @param {WebpackConfig} wpConfig Webpack config object
	 * @returns {WebpackPluginInstance | undefined}
	 */
	// @ts-ignore
	beforecompile: (env, wpConfig) =>
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
						wpPlugin.tsc.buildTypes(_env);
						if (isTestsBuild) {
							wpPlugin.tsc.buildTests(_env);
						}
					} catch {}
				});
			}
		};
		return plugin;
	},

	// @ts-ignore
	aftercompile: (env, wpConfig) =>
	{
		// @ts-ignore
		// const _env = { ...env };
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
		// return plugin;
	},


	/**
	 * @param {WebpackEnvironment} env
	 * @param {WebpackConfig} wpConfig Webpack config object
	 * @returns {CopyPlugin | undefined}
	 */
	copy: (env, wpConfig) =>
	{
		let plugin;
		const /** @type {CopyPlugin.Pattern[]} */patterns = []; // ,
			  // psx__dirname = env.buildPath.replace(/\\/g, "/"),
			  // psxBasePath = env.basePath.replace(/\\/g, "/"),
			  // psxBaseCtxPath = path.posix.join(psxBasePath, "res");
		if (env.build === "tests")
		{
			// apps.filter(app => fs.existsSync(path.join(env.basePath, app, "res"))).forEach(
			// 	app => patterns.push(
			// 	{
			// 		from: path.posix.join(psxBasePath, app, "res", "*.*"),
			// 		to: path.posix.join(psx__dirname, "res", "webview"),
			// 		context: path.posix.join(psxBasePath, app, "res")
			// 	})
			// );
			// if (fs.existsSync(path.join(env.basePath, "res")))
			// {
			// 	patterns.push({
			// 		from: path.posix.join(psxBasePath, "res", "*.*"),
			// 		to: path.posix.join(psx__dirname, "res", "webview"),
			// 		context: psxBaseCtxPath
			// 	});
			// }
		}
		else if (env.build === "node" && wpConfig.mode === "production")
		{
			// const psx__dirname_info = path.posix.normalize(path.posix.join(psx__dirname, "..", "vscode-taskexplorer-info"));
			// patterns.push(
			// {
			// 	from: path.posix.join(psxBasePath, "res", "img", "**"),
			// 	to: path.posix.join(psx__dirname_info, "res"),
			// 	context: psxBaseCtxPath
			// });
		}
		if (patterns.length > 0) {
			plugin = new CopyPlugin({ patterns });
		}
		return plugin;
	},


	figures:
	{
		colors,
		error: "✘",
		info: "ℹ",
		success: "✔",
		warning: "⚠",
		withColor,
		color:
		{
			success: withColor("✔", colors.green),
			successBlue: withColor("✔", colors.blue),
			info: withColor("ℹ", colors.magenta),
			infoTask: withColor("ℹ", colors.blue),
			warning: withColor("⚠", colors.yellow),
			warningTests: withColor("⚠", colors.blue),
			error: withColor("✘", colors.red),
			errorTests: withColor("✘", colors.blue)
		}
	},


	/**
	 * @param {WebpackEnvironment} env
	 * @param {WebpackConfig} wpConfig Webpack config object
	 * @returns {webpack.optimize.LimitChunkCountPlugin | undefined}
	 */
	// @ts-ignore
	limitchunks: (env, wpConfig) =>
	{
		/** @type {webpack.optimize.LimitChunkCountPlugin | undefined} */
		let plugin;
		if (env.build === "browser")
		{
			plugin = new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 });
		}
		return plugin;
	},


	optimize:
	{
		/**
		 * @param {WebpackEnvironment} env
		 * @param {WebpackConfig} wpConfig Webpack config object
		 * @returns {webpack.NoEmitOnErrorsPlugin | undefined}
		 */
		// @ts-ignore
		noEmitOnError: (env, wpConfig) =>
		{
			return new webpack.NoEmitOnErrorsPlugin();
		}
	},


	tsc:
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

	}

};

module.exports = {
	wpPlugin
};
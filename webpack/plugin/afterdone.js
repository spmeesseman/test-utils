/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.afterdone
 */

import { join } from "path";
import { renameSync, existsSync, writeFileSync, readFileSync } from "fs";

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types/webpack").WebpackPluginInstance} WebpackPluginInstance */


 /**
  * @param {WebpackEnvironment} env
  * @param {WebpackConfig} wpConfig Webpack config object
  * @returns {WebpackPluginInstance | undefined}
  */
const afterdone = (env, wpConfig) =>
{
   /** @type {WebpackPluginInstance | undefined} */
   let plugin;
   if (env.build !== "tests")
   {
       const _env = { ...env },
             _wpConfig = { ...wpConfig };
       plugin =
       {   /** @param {import("webpack").Compiler} compiler Compiler */
           apply: (compiler) =>
           {
               compiler.hooks.done.tap("AfterDonePlugin", () =>
               {
                   if (_wpConfig.mode === "production")
                   {
                       try {
                           renameSync(join(env.buildPath, "dist", "testutils.cjs.LICENSE.txt"), join(env.buildPath, "dist", "testutils.LICENSE"));
                       } catch {}
                   }
                    const outFile = join(env.buildPath, "dist", "testutils.cjs");
                    if (existsSync(outFile))
                    {
                        let content = readFileSync(outFile, "utf8");
                        if (_env.environment === "test")
                        {
                            const regex = /\n[ \t]*module\.exports \= require\(/mg;
                            content = content.replace(regex, (v) => "/* istanbul ignore next */" + v);
                        }
                        content = content.replace(/____require____\(/mg, "require(");
                        content = content.replace(/____require.resolve____/mg, "require.resolve");
                        writeFileSync(outFile, content);
                    }
               });
           }
       };
   }
   return plugin;
};


export default afterdone;

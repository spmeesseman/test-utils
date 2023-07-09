export default {};
// /* eslint-disable import/no-extraneous-dependencies */
// 
// import * as fs from "fs";
// import * as path from "path";
// 
// 
// let cd: string | undefined,
//     extensionDevelopmentPath = path.resolve(__dirname, "..");
// while (!fs.existsSync(path.join(extensionDevelopmentPath, "package,json")) && extensionDevelopmentPath.length > 3 && extensionDevelopmentPath.includes(path.sep)) {
//     extensionDevelopmentPath = path.resolve(extensionDevelopmentPath, "..");
// }
// if (process.cwd() !== extensionDevelopmentPath) {
//     cd = process.cwd();
//     process.chdir(extensionDevelopmentPath);
// }
// 
// import { execSync } from "child_process";
// import { runTests } from "@vscode/test-electron";
// 
// 
// const main = async () =>
// {
//     if (!process.env.VSC_TESTS_MACHINEID)
//     {
//         consoleWrite("The environment variable VSC_TESTS_MACHINEID was not found", figures.color.warning);
//         consoleWrite("   Ensure it is set in the System Environment to the development machine's VSCode.machineID", figures.color.warning);
//         consoleWrite("   All instances of VSCode must be closed and then re-opened to pick up any new or changed env var", figures.color.warning);
//         consoleWrite("Exiting", figures.color.warning);
//         process.exit(1);
//     }
// 
//     consoleWrite(logSep);
//     consoleWrite("Test Runner Initializing");
//     consoleWrite(`   extension development path  : ${extensionDevelopmentPath}`);
//     if (cd) {
//         consoleWrite(`   previous working directory  : ${process.cwd()}`);
//     }
// 
//     let failed = false,
//         multiRoot = false;
// 
//     const extensionTestsPath = path.resolve(__dirname, "./suite"),
//           distPath = path.join(extensionDevelopmentPath, "dist"),
//           testWorkspaceSingleRoot = path.resolve(__dirname, path.join("..", "..", "..", "client", "testFixture", "project1")),
//           testWorkspaceMultiRoot = path.resolve(__dirname, path.join("..", "..", "..", "client", "testFixture")),
//           vscodeTestUserDataPath = path.join(extensionDevelopmentPath, ".vscode-test", "user-data"),
//           project1Path = testWorkspaceSingleRoot,
//           project2Path = path.join(testWorkspaceMultiRoot, "project2"),
//           pkgJsonFile = path.resolve(__dirname, path.join(extensionDevelopmentPath, "package.json")),
//           pkgJson = fs.readFileSync(pkgJsonFile, "utf8"),
//           pkgJso = JSON.parse(pkgJson),
//           scriptsPath = path.join(extensionDevelopmentPath, "script"),
//           vsCodeTestVersion = pkgJso.engines.vscode.replace(/[^0-9a-z\-\.]/g, ""),
//           projectSettingsFile = path.join(project1Path, ".vscode", "settings.json"),
//           multiRootWsFile = path.join(testWorkspaceMultiRoot, "tests.code-workspace"),
//           defaultSettings = createDefaultSettings(),
//           project1AppJsonFile = path.join(testWorkspaceSingleRoot , "app.json"),
//           project1ExtjsRcFile = path.join(testWorkspaceSingleRoot , ".extjsrc.json"),
//           project1ErrorFile = path.join(testWorkspaceSingleRoot , "_app.json"),
//           appJson = fs.readFileSync(project1AppJsonFile),
//           extjsrcJson = fs.readFileSync(project1ExtjsRcFile);
// 
//     consoleWrite(logSep);
//     consoleWrite("Runtime parameters");
//     consoleWrite(`   vscode test version     : ${vsCodeTestVersion}`);
//     consoleWrite(`   single root             : ${testWorkspaceSingleRoot}`);
//     consoleWrite(`   multi root              : ${testWorkspaceMultiRoot}`);
//     consoleWrite(`   extension tests path    : ${extensionTestsPath}`);
//     consoleWrite(`   user data path          : ${vscodeTestUserDataPath}`);
//     consoleWrite(`   project 1 path          : ${project1Path}`);
//     consoleWrite(`   project 2 path          : ${project2Path}`);
//     consoleWrite(`   dist path               : ${distPath}`);
//     consoleWrite(`   scripts path            : ${scriptsPath}`);
//     consoleWrite(`   package file            : ${pkgJsonFile}`);
//     consoleWrite(`   project settings file   : ${projectSettingsFile}`);
//     consoleWrite(`   multi-root ws file      : ${multiRootWsFile}`);
//     consoleWrite(`   project1 app file       : ${project1AppJsonFile}`);
//     consoleWrite(`   project1 rc file        : ${project1ExtjsRcFile}`);
//     consoleWrite(`   project1 Error file     : ${project1ErrorFile}`);
//     consoleWrite(logSep);
// 
//     const mwsConfig: Record<string, any> =
//     {
//         folders: [
//         {
//             name: "project1",
//             path: "project1"
//         },
//         {
//             name: "project2",
//             path: "project2"
//         }],
//         settings: defaultSettings
//     };
// 
//     try
//     {
//         const args = process.argv.slice(2),
//               xArgs: string[] = [],
//               testsArgs: string[] = [];
//         if (args && args.length > 0)
//         {
//             consoleWrite("   arguments               : " + args.join(", "));
//             args.forEach((a) =>
//             {
//                 if (a.startsWith("-"))
//                 {
//                     xArgs.push(a);
//                     if (a === "--multi-root") {
//                         multiRoot = true;
//                     }
//                 }
//                 else {
//                     testsArgs.push(a);
//                 }
//             });
//             consoleWrite("   xargs                   : " + xArgs.join(", "));
//             consoleWrite("   testargs                : " + testsArgs.join(", "));
//         }
//         else {
//             consoleWrite("   arguments               : none");
//         }
// 
//         consoleWrite("clear package.json activation event");
//         execSync("sh ./enable-full-coverage.sh", { cwd: scriptsPath });
//         //
//         // Clear workspace settings file if it exists
//         //
//         if (!multiRoot) {
//             fs.writeFileSync(projectSettingsFile, JSON.stringify(defaultSettings, null, 4));
//         }
//         else {
//             fs.writeFileSync(multiRootWsFile, JSON.stringify(mwsConfig, null, 4));
//         }
// 
//         //
//         // const runCfg = await runConfig();
// 
//         // //
//         // // Install Task Explorer extension
//         // //
//         // const vscodeExecutablePath = await downloadAndUnzipVSCode("1.35.0")
// 		// const [ cli, ...args ] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);
// 		// spawnSync(cli, [ ...args, "--install-extension", "spmeesseman.vscode-taskexplorer" ], {
// 		// 	encoding: "utf-8",
// 		// 	stdio: "inherit"
// 		// });
// 
//         // if (process.platform === "win32") {
// 		// 	await runTests({
// 		// 		extensionDevelopmentPath,
// 		// 		extensionTestsPath,
// 		// 		version: "1.40.0",
// 		// 		platform: "win32-x64-archive"
// 		// 	});
// 		// }
// 
//         consoleWrite(logSep);
// 
//         //
//         // Download VS Code, unzip it and run the integration test
//         //
//         const testsWorkspace = !multiRoot ? testWorkspaceSingleRoot : multiRootWsFile;
//         await runTests(
//         {
//             version: vsCodeTestVersion,
//             extensionDevelopmentPath,
//             extensionTestsPath,
//             launchArgs: [
//                 testsWorkspace,
//                 "--disable-extensions",
//                 "--disable-workspace-trust"
//             ],
//             extensionTestsEnv: {
//                 xArgs: JSON.stringify(xArgs),
//                 testArgs: JSON.stringify(testsArgs),
//                 vsCodeTestVersion,
//                 testsMachineId: process.env.VSC_TESTS_MACHINEID
//             }
//         }); // --upload-logs could be interesting (for prod).  look at it sometime.
//     }
//     catch (err: any) {
//         consoleWrite(`Failed to run tests: ${err}\n${err.stack ?? "No call stack details found"}`, figures.color.error);
//         failed = true;
//     }
//     finally
//     {   try //
//         {   // Log file - whats a good way to open it in the active vscode instance???
//             //
//             // let logFile: string | undefined;
//             // if (testControl.log.enabled && testControl.log.file && testControl.log.openFileOnFinish)
//             // {
//             //     let lastDateModified: Date | undefined;
//             //     const tzOffset = (new Date()).getTimezoneOffset() * 60000,
//             //         dateTag = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1).split("T")[0].replace(/[\-]/g, ""),
//             //         vscodeLogPath = path.join(vscodeTestUserDataPath, "logs");
//             //     const paths = await findFiles(`**/spmeesseman.vscode-taskexplorer/taskexplorer-${dateTag}.log`,
//             //     {
//             //         nocase: false,
//             //         ignore: "**/node_modules/**",
//             //         cwd: vscodeLogPath
//             //     });
//             //     for (const relPath of paths)
//             //     {
//             //         const fullPath = path.join(vscodeLogPath, relPath),
//             //             dateModified = await getDateModified(fullPath);
//             //         if (dateModified && (!lastDateModified || dateModified.getTime() > lastDateModified.getTime()))
//             //         {
//             //             logFile = fullPath;
//             //             lastDateModified = dateModified;
//             //         }
//             //     }
//             //     if (logFile) {
//             //         const code = path.join(process.env.CODE_HOME || "c:\\Code", "Code.exe");
//             //         // execSync(`cmd /c ${code} "${logFile}" --reuse-window`, { cwd: extensionDevelopmentPath, stdio: "ignore" });//.unref();
//             //     }
//             // }
//             //
//             // Restore
//             //
//             consoleWrite("restore package.json activation event");
//             // execSync(`enable-full-coverage.sh --off${logFile ? ` --logfile "${logFile}` : ""}"`, { cwd: scriptsPath });
//             execSync("sh ./enable-full-coverage.sh --off", { cwd: scriptsPath });
//             // if (settingsJsonOrig && !testControl.keepSettingsFileChanges) {
//             // if (!testControl.keepSettingsFileChanges)
//             // {
//                 consoleWrite("restore tests workspace settings file settings.json");
//                 if (!multiRoot)
//                 {
//                     fs.writeFileSync(projectSettingsFile, JSON.stringify(defaultSettings, null, 4));
//                 }
//                 else
//                 {
//                     mwsConfig.settings = defaultSettings;
//                     fs.writeFileSync(multiRootWsFile, JSON.stringify(mwsConfig, null, 4));
//                 }
//             // }
//             consoleWrite("delete any leftover temporary files and/or directories and revert changes from errors");
//             // fs.rmSync(path.join(project1Path, "tasks_test_"), { recursive: true });
//             // fs.rmSync(path.join(project1Path, "tasks_test_ignore_"), { recursive: true });
//             if (fs.existsSync(project1ErrorFile)) {
//                 fs.unlinkSync(project1ErrorFile);
//                 fs.writeFileSync(path.join(testWorkspaceSingleRoot , "app.json"), appJson);
//                 fs.writeFileSync(path.join(testWorkspaceSingleRoot , ".extjsrc.json"), extjsrcJson);
//             }
//         }
//         catch {}
// 
//         if (failed) {
//             process.exit(1);
//         }
//     }
// };
// 
// 
// const logSep = "----------------------------------------------------------------------------------------------------";
// const createDefaultSettings = () =>
// {
//     return {
//         "extjsIntellisense.logging.client.enable": false,
//         "extjsIntellisense.logging.client.level": 1,
//         "extjsIntellisense.logging.client.enableFile": false,
//         "extjsIntellisense.logging.client.enableFileSymbols": false,
//         "extjsIntellisense.logging.client.enableOutputWindow": false,
//         "extjsIntellisense.logging.server.enable": false,
//         "extjsIntellisense.logging.server.level": 1,
//         "extjsIntellisense.logging.server.enableFile": false,
//         "extjsIntellisense.logging.server.enableFileSymbols": false,
//         "extjsIntellisense.logging.server.enableOutputWindow": false,
//         "extjsIntellisense.trackUsage": true
//     };
// };
// 
// 
// main().catch((e: any) => { try { console.error(e.message); } catch (_) {}  process.exit(1); });
// 
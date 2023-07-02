/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */

import * as fs from "fs";
import * as path from "path";

let cd: string | undefined;
const extensionDevelopmentPath = path.resolve(__dirname, "../../");
if (process.cwd() !== extensionDevelopmentPath) {
    cd = process.cwd();
    process.chdir(extensionDevelopmentPath);
}

import { execSync } from "child_process";
import { runTests } from "@vscode/test-electron";


const main = async () =>
{
    if (!process.env.VSC_TESTS_MACHINEID)
    {
        consoleWrite("The environment variable VSC_TESTS_MACHINEID was not found", figures.color.warning);
        consoleWrite("   Ensure it is set in the System Environment to the development machine's VSCode.machineID", figures.color.warning);
        consoleWrite("   All instances of VSCode must be closed and then re-opened to pick up any new or changed env var", figures.color.warning);
        consoleWrite("Exiting", figures.color.warning);
        process.exit(1);
    }

    consoleWrite(logSep);
    consoleWrite("Test Runner Initializing");
    consoleWrite(`   extension development path  : ${extensionDevelopmentPath}`);
    if (cd) {
        consoleWrite(`   previous working directory  : ${process.cwd()}`);
    }

    let failed = false,
        multiRoot = false;

    const extensionTestsPath = path.resolve(__dirname, "./suite"),
          distPath = path.join(extensionDevelopmentPath, "dist"),
          testWorkspaceSingleRoot = path.resolve(__dirname, path.join("..", "..", "test-fixture", "project1")),
          testWorkspaceMultiRoot = path.resolve(__dirname, path.join("..", "..", "test-fixture")),
          vscodeTestUserDataPath = path.join(extensionDevelopmentPath, ".vscode-test", "user-data"),
          project1Path = testWorkspaceSingleRoot,
          project2Path = path.join(testWorkspaceMultiRoot, "project2"),
          pkgJsonPath = path.resolve(__dirname, path.join(extensionDevelopmentPath, "package.json")),
          pkgJson = fs.readFileSync(pkgJsonPath, "utf8"),
          pkgJso = JSON.parse(pkgJson),
          vsCodeTestVersion = pkgJso.engines.vscode.replace(/[^0-9a-z\-\.]/g, ""),
          projectSettingsFile = path.join(project1Path, ".vscode", "settings.json"),
          multiRootWsFile = path.join(testWorkspaceMultiRoot, "tests.code-workspace");


    consoleWrite(logSep);
    consoleWrite("Runtime parameters");
    consoleWrite(`   vscode test version     : ${vsCodeTestVersion}`);
    consoleWrite(`   single root             : ${testWorkspaceSingleRoot}`);
    consoleWrite(`   multi root              : ${testWorkspaceMultiRoot}`);
    consoleWrite(`   extension tests path    : ${extensionTestsPath}`);
    consoleWrite(`   user data path          : ${vscodeTestUserDataPath}`);
    consoleWrite(`   project 1 path          : ${project1Path}`);
    consoleWrite(`   project 2 path          : ${project2Path}`);
    consoleWrite(`   dist path               : ${distPath}`);
    consoleWrite(`   project settings file   : ${projectSettingsFile}`);
    consoleWrite(`   multi-root ws file      : ${multiRootWsFile}`);
    consoleWrite(logSep);

    try
    {
        const args = process.argv.slice(2),
              xArgs: string[] = [],
              testsArgs: string[] = [];
        if (args && args.length > 0)
        {
            consoleWrite("   arguments                   : " + args.join(", "));
            args.forEach((a) =>
            {
                if (a.startsWith("-"))
                {
                    xArgs.push(a);
                    if (a === "--multi-root") {
                        multiRoot = true;
                    }
                }
                else {
                    testsArgs.push(a);
                }
            });
            consoleWrite("   xargs                       : " + xArgs.join(", "));
            consoleWrite("   testargs                    : " + testsArgs.join(", "));
        }
        else {
            consoleWrite("   arguments                   : none");
        }

        consoleWrite("clear package.json activation event");
        execSync("sh ./enable-full-coverage.sh", { cwd: "script" });

        consoleWrite(logSep);

        //
        // Download VS Code, unzip it and run the integration test
        //
        const testsWorkspace = !multiRoot ? testWorkspaceSingleRoot : multiRootWsFile;
        await runTests(
        {
            version: vsCodeTestVersion,
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [
                testsWorkspace,
                "--disable-extensions",
                "--disable-workspace-trust"
            ],
            extensionTestsEnv: {
                xArgs: JSON.stringify(xArgs),
                testArgs: JSON.stringify(testsArgs),
                vsCodeTestVersion,
                testsMachineId: process.env.VSC_TESTS_MACHINEID
            }
        });
    }
    catch (err: any) {
        consoleWrite(`Failed to run tests: ${err}\n${err.stack ?? "No call stack details found"}`, figures.color.error);
        failed = true;
    }
    finally //
    {   try // Restore activation events fiels
        {   //
            consoleWrite("restore package.json activation event");
            execSync("sh ./enable-full-coverage.sh --off", { cwd: "script" });
        }
        catch {}

        if (failed) {
            process.exit(1);
        }
    }
};

const logSep = "----------------------------------------------------------------------------------------------------";

const consoleWrite = (msg: string, icon?: string, pad = "") =>
    console.log(`     ${pad}${icon || figures.color.info}${msg ? " " + figures.withColor(msg, colors.grey) : ""}`);

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

const withColor = (msg: string, color: number[]) => "\x1B[" + color[0] + "m" + msg + "\x1B[" + color[1] + "m";

const figures =
{
    withColor,
    success: "✔",
    info: "ℹ",
	warning: "⚠",
	error: "✘",
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
};

main().catch((e: any) => { try { console.error(e.message); } catch (_) {}  process.exit(1); });

// @ts-check

declare type WebpackBuild = "browser"|"node"|"types"|"tests";
declare type WebpackBuildEnvironment= "dev"|"prod"|"test"|"testprod";
declare type WebpackLogLevel = "none" | "error" | "warn" | "info" | "log" | "verbose" | undefined;
declare type WebpakTarget = "webworker"|"node"|"web";
declare type WebpackBuildOrUndefined = WebpackBuild|undefined;
declare type WebpackConfig = import("webpack").Configuration;
declare type WebpackPluginInstance = import("webpack").WebpackPluginInstance;
declare type WebpackOptimization = any;

declare interface WebpackEnvironment
{
    analyze: boolean;
    basePath: string;
    build: WebpackBuild;
    buildPath: string;
    clean: boolean;
    environment: WebpackBuildEnvironment;
    esbuild: boolean; // Is ES build
    imageOpt: boolean; // Perform image optimization
    target: WebpakTarget;
    verbosity: WebpackLogLevel;
}

export {
    WebpackBuild,
    WebpackBuildOrUndefined,
    WebpackConfig,
    WebpackPluginInstance,
    WebpackOptimization,
    WebpackEnvironment,
    WebpackLogLevel,
    WebpakTarget,
    WebpackBuildEnvironment
};

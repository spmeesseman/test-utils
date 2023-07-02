import { figures } from "./figures";


export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export const writeErrorsAreOk = () =>
{

    console.log(`    ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}`);
    console.log(`    ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.up}  ${figures.withColor("  THESE ERRORS WERE SUPPOSED TO HAPPEN!!!  ", figures.colors.green)}  ` +
                `${figures.color.up}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}`);
    console.log(`    ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ` +
                `${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}  ${figures.color.success}`);

};


export const colors = {
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
export const write = (msg, color) => "\x1B[" + color[0] + "m" + msg + "\x1B[" + color[1] + "m";


export const writeInfo = (msg, icon, pad = "") =>
    console.log(`     ${pad}${icon || figures.color.info}${msg ? " " + figures.write(msg, figures.colors.grey) : ""}`);


export const figures =
{
    colors,
    error: "✘",
    info: "ℹ",
    success: "✔",
    warning: "⚠",
    write,
    writeInfo,
    color:
    {
        success: write("✔", colors.green),
        successBlue: write("✔", colors.blue),
        info: write("ℹ", colors.magenta),
        infoTask: write("ℹ", colors.blue),
        warning: write("⚠", colors.yellow),
        warningTests: write("⚠", colors.blue),
        error: write("✘", colors.red),
        errorTests: write("✘", colors.blue)
    }
};

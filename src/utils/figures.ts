
export type LogColor = [ number, number ];
export type LogStyle = [ number, number ];

interface ILogColors
{
    bold: LogColor;
    italic: LogColor;
    underline: LogColor;
    inverse: LogColor;
    white: LogColor;
    grey: LogColor;
    black: LogColor;
    blue: LogColor;
    cyan: LogColor;
    green: LogColor;
    magenta: LogColor;
    red: LogColor;
    yellow: LogColor;
};

class LogColors implements ILogColors
{
    bold: LogStyle = [ 1, 22 ];
    italic: LogStyle = [ 3, 23 ];
    underline: LogStyle = [ 4, 24 ];
    inverse: LogStyle = [ 7, 27 ];
    white: LogColor = [ 37, 39 ];
    grey: LogColor = [ 90, 39 ];
    black: LogColor = [ 30, 39 ];
    blue: LogColor = [ 34, 39 ];
    cyan: LogColor = [ 36, 39 ];
    green: LogColor = [ 32, 39 ];
    magenta: LogColor = [ 35, 39 ];
    red: LogColor = [ 31, 39 ];
    yellow: LogColor = [ 33, 39 ];
};

export const colors = new LogColors();

export const withColor = (msg: string, color: LogColor) => "\x1B[" + color[0] + "m" + msg + "\x1B[" + color[1] + "m";

export const figures = {
    colors,
    withColor,
    success: "✔",
    info: "ℹ",
	warning: "⚠",
	error: "✘",
	pointer: "❯",
	start: "▶",
	end: "◀",
	nodejs: "⬢",
	star: "★",
	checkboxOn: "☒",
	checkboxOff: "☐",
	pointerSmall: "›",
	bullet: "●",
    up: "△",
    color:
    {
        success: withColor("✔", colors.green),
        successBlue: withColor("✔", colors.blue),
        info: withColor("ℹ", colors.magenta),
        infoTask: withColor("ℹ", colors.blue),
        warning: withColor("⚠", colors.yellow),
        warningTests: withColor("⚠", colors.blue),
        error: withColor("✘", colors.red),
        errorTests: withColor("✘", colors.blue),
        start: withColor("▶", colors.green),
        end: withColor("◀", colors.green),
        pointer: withColor("❯", colors.grey),
        up: withColor("△", colors.green),
    }

};

import { getFullKonsoleCommand, TnewinOptions } from "../commandAndArguments";

type TermianlStrategy = (cmds: Array<string>, options: TnewinOptions) => {}

export const konsoleStrategy: TermianlStrategy = (cmds, options: TnewinOptions) => {
    const allFullCommands = cmds.map((cmd) => {getFullKonsoleCommand(cmd, options)}).join('\n')
    return allFullCommands;
};

export const gnomeStrategy: TermianlStrategy = (cmds, options: TnewinOptions) => {
    return 'gnome comands :D';
};
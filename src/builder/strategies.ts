import { TermianlStrategy, TnewinOptions } from "types/types";
import { getFullKonsoleCommand, getGnomeArguments } from "../commandAndArguments";

export const konsoleStrategy: TermianlStrategy = (cmd: string, options: TnewinOptions): string => {
    const allFullCommands = getFullKonsoleCommand(cmd, options)
    return allFullCommands;
};

export const gnomeStrategy: TermianlStrategy = (cmd: string, options: TnewinOptions): string => {
    const temrinalHeader: string = 'gnome-terminal'
    const terminalOptions: string = getGnomeArguments(options)
    const close: string = options.close ? '' : 'exec bash'
    return `${temrinalHeader} ${terminalOptions} --hide-menubar -- bash -c '${cmd}; ${close}'`
};
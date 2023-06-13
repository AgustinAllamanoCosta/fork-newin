import { getFullLinuxCommand, TnewinOptions } from "commandAndArguments";

export const konsoleStrategy = (cmds,options:TnewinOptions)=>{
    const allFullCommands = cmds.map((cmd) => getFullLinuxCommand(cmd, options)).join('\n')
    return allFullCommands;
};
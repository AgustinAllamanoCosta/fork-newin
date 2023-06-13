import { konsoleStrategy } from './strategies'
import * as networkDrive from 'windows-network-drive'
import { getFullCommandWindows, isWSL, isWSLOrWindows, TnewinOptions } from '../commandAndArguments'

export const terminalBuilder = async (cmds, debug: boolean, options: TnewinOptions) => {
    if (isWSLOrWindows()) {
        return await buildWindows(cmds, debug, options)
    } else {
        return buildLinux(cmds, debug, options)
    }
}

const buildWindows = async (cmds, debug, options: TnewinOptions) => {
    if (networkDrive.isWinOs()) options.mappedDrives = await networkDrive.list()

    const terminals = []
    for (const cmd of cmds) {
        const fullCommand = getFullCommandWindows(cmd, options)
        if (debug || options.debug)
            console.debug(`neWin(${isWSL() ? 'WSL' : 'Windows'}) DEBUG: Executing single command:\n`, fullCommand)
        terminals.push(fullCommand)
    }
    return terminals
}

const buildLinux = (cmds, debug, options: TnewinOptions) => {
    const terminal = process.env.TERM

    const buildCommand = selectLinuxStrategy(terminal)
    const terminals = buildCommand(cmds, options)
    
    if (debug || options.debug)
        console.debug('neWin(linux) DEBUG: Executing all commands at once:\n', terminals)
    
    return terminals
}

const selectLinuxStrategy = (terminalType: string)=>{
    switch(terminalType){
        default:
            return konsoleStrategy
    }
}
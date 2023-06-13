import { konsoleStrategy } from 'builder/strategies'
import { exec } from 'node:child_process'
import * as networkDrive from 'windows-network-drive'
import { getFullCommandWindows, isWSL, isWSLOrWindows, TnewinOptions } from '../commandAndArguments'

const linuxTerminalStrategies = {
    konsole: konsoleStrategy
}

export const terminalBuilder = async (cmds, debug: boolean, execCallback, options: TnewinOptions) => {
    if (isWSLOrWindows()) {
        await buildWindows(cmds,debug,execCallback,options)
    } else {
        buildLinux(cmds,debug,execCallback,options)
    }
}

const buildWindows = async (cmds, debug, execCallback ,options: TnewinOptions) => {
    if (networkDrive.isWinOs()) options.mappedDrives = await networkDrive.list()

    for (const cmd of cmds) {
        const fullCommand = getFullCommandWindows(cmd, options)
        if (debug || options.debug)
            console.debug(`neWin(${isWSL() ? 'WSL' : 'Windows'}) DEBUG: Executing single command:\n`, fullCommand)
        exec(fullCommand, execCallback)
    }
}

const buildLinux = (cmds,debug,execCallback, options: TnewinOptions)=>{
    const terminal = process.env.TERM
    const buildCommand = linuxTerminalStrategies[terminal ? terminal : 'konsole']
    const fullCommand = buildCommand(cmds,options)
    if (debug || options.debug)
        console.debug('neWin(linux) DEBUG: Executing all commands at once:\n', fullCommand)

    exec(fullCommand, execCallback)
    process.exit(0)
}
import { gnomeStrategy, konsoleStrategy } from './strategies'
import * as networkDrive from 'windows-network-drive'
import { getFullCommandWindows, isWSL, isWSLOrWindows } from '../commandAndArguments'
import { TerminalStrategy, TnewinOptions } from 'types/types'

export const terminalBuilder = async (cmd: string, debug: boolean, options: TnewinOptions) => {
  if (isWSLOrWindows()) {
    return await buildWindows(cmd, debug, options)
  } else {
    return buildLinux(cmd, debug, options)
  }
}

const buildWindows = async (cmd: string, debug: boolean, options: TnewinOptions) => {
  if (networkDrive.isWinOs()) options.mappedDrives = await networkDrive.list()

  const fullCommand = getFullCommandWindows(cmd, options)
  if (debug || options.debug)
    console.debug(
      `neWin(${isWSL() ? 'WSL' : 'Windows'}) DEBUG: Executing single command:\n`,
      fullCommand
    )
  return fullCommand
}

const buildLinux = (cmd: string, debug: boolean, options: TnewinOptions) => {
  const terminal = process.env.TERM

  const buildCommand: TerminalStrategy = selectLinuxStrategy(terminal)
  const terminals = buildCommand(cmd, options)

  if (debug || options.debug)
    console.debug('neWin(linux) DEBUG: Executing all commands at once:\n', terminals)
  return terminals
}

const selectLinuxStrategy = (terminalType: string): TerminalStrategy => {
  switch (terminalType) {
    case 'gnome-terminal':
      return gnomeStrategy
    case 'xterm-256color':
      return gnomeStrategy
    case 'xterm':
      return gnomeStrategy
    case 'rxvt-unicode':
      return gnomeStrategy
    default:
      return konsoleStrategy
  }
}

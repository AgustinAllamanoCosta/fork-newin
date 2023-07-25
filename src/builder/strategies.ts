import { TerminalStrategy, TnewinOptions } from 'types/types'
import { getFullKonsoleCommand, getGnomeArguments } from '../commandAndArguments'

export const konsoleStrategy: TerminalStrategy = (
  cmd: string,
  options: TnewinOptions
): string => {
  const allFullCommands = getFullKonsoleCommand(cmd, options)
  return allFullCommands
}

export const gnomeStrategy: TerminalStrategy = (
  cmd: string,
  options: TnewinOptions
): string => {
  const terminalHeader: string = 'gnome-terminal'
  const terminalOptions: string = getGnomeArguments(options)
  const close: string = options.close ? '' : 'exec bash'
  return `${terminalHeader} ${terminalOptions} --hide-menubar -- bash -c '${cmd}; ${close}'`
}

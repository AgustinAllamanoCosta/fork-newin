#!/usr/bin/env node
import * as process from 'node:process'
import { Command } from 'commander'

import { terminalBuilder } from './builder/terminalBuilder'
import { DESCRIPTION } from './immutable'
import { execCallback } from './utils'
import { exec } from 'node:child_process'
import { TnewinOptions } from './types/types'

const debug: boolean = false

const program: Command = new Command()
program
  .description(
    DESCRIPTION
  )
  .arguments('[cmds...]')
  .option(
    '-d --workdir <workdir>',
    `Specify working directory of new window. It is relative to CWD, unless it starts with '/' or '~' where it becomes absolute. Default is CWD.`,
    '.'
  )
  .option('-n, --new-tab', 'Open a new Tab instead of a new Window. Default is new Window.')
  .option(
    '-t, --title <title>',
    `(WT Only) Specify title for new Window/Tab. It suppresses native app titles.
It defaults to <lastPath>: $ <bashCmd>
- A nodejs specific tweak is that if a bash command starts with "npm run", "npm-run-all" or "npx", these are removed!
  For example $ newin --workdir '~/project' 'npm run start:watch'
  becomes the title "/project: $ start:watch"`
  )
  .option('-o --notitle', 'Leave the title alone!')

  .option('-c --color <hexcode>', '(WT Only) Set color of Tab.')
  .option('-e --echo', '(WT Only) Echo bash command before executing.')
  .option(
    '-l --close',
    '(Konsole only) Close the initial session automatically when it ends (Konsole executed by default with --hold).'
  )
  .option(
    '-s --separate',
    '(Konsole only) Run the new instance of Konsole in a separate process.'
  )
  .option(
    '-p, --profile [profileName]',
    'Use this profile, by name. NOTE: on Windows Terminal, it uses the profile settings (colors, fonts etc) BUT RUNS ON CURRENT DISTRO, for some esoteric Microsoft reason ;-('
  )
  .option('--debug', 'Enable debugging, outputs the command(s) before executing.')
  .action(async (cmds: Array<string>, options: TnewinOptions) => {
    // prettier-ignore
    if (debug || options.debug)
      console.log('neWin DEBUG: executing', cmds.length, 'commands:\n', cmds.join('\n'))

    if (!Array.isArray(cmds))
      throw new Error(`neWin Error: wrong cmds, should be an array: ${JSON.stringify(cmds)}`)

    if (cmds.length === 0) cmds.push('')

    for(const cmd of cmds){
      const terminal: string = await terminalBuilder(cmd, debug, options)
      exec(terminal, execCallback)
    }
    process.exit(0)

  })
  .parse(process.argv)

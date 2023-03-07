#!/usr/bin/env node

import { exec } from 'node:child_process'
import * as process from 'node:process'
import { Command } from 'commander'
import { getFullCommand, isWSL, TnewinOptions } from './commandAndArguments'

const debug = false

const execCallback = (error, stdout, stderr) => {
  if (error) {
    console.log(`neWin error: ${error.message}`)
  } else if (stderr) {
    console.log(`neWin stderr: ${stderr}`)
  } else if (stdout) {
    console.log(`neWin stdout: ${stdout}`)
  }
}

const program = new Command()
program
  .description(
    `Opens multiple new windows/tabs on KDE Konsole or Windows Terminal (WT) & execute given bash command(s).

  * Works as-is from either WSL linux shell or a native Linux KDE konsole shell!

  * It uses the default Konsole / WT Profile.

  * It uses a workdir relative to CWD or an absolute dir.

  * On WSL, it always calls "source /etc/environment" to set the correct path and environment variables.

  Notes:

  * On WSL, make sure $WSL_INTEROP variable is set and working (i.e you should be able to execute "$ wt.exe" etc on your WSL shell)

  * On Linux Konsole, DONT use multiple bash commands for each window, as it fails in various ways (it's Konsole's fault as far as I can dig, please help if you know better). For example DONT USE $ newin "ls & npm -v". Opening in multiple windows (eg $ newin "ls" "npm -v") works as expected!

  Examples:

    $ newin                                          # opens a new window on CWD

    $ newin -workdir /mnt                            # opens a new window on /mnt

    $ newin -workdir ./projects                      # opens a new window on ./projects, relative to CWD

    $ newin 'npm -v' 'node -v'                       # execute 'npm -v' on a new window and 'node -v' on another one.

    $ newin -p 'Ubuntu-20.04'                        # use this profile name. NOTE: in current distro only - see below.

    $ newin --color AF3 --title foo "node -v"

    $ newin --color AF3 --title 'ZenDash: test:watch' --workdir 'projects/devzen/packages/zendash' 'node -v'

  Note: Commands that are (Konsole only) or (WT Only) are ignored on the other environment.
  `
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

A nodejs specific tweek is that if a bash command starts with "npm run", "npm-run-all" or "npx", these are removed!

Eg $ newin  --workdir '~/project' 'npm run start:watch'

gives rise to the title "/project: $ start:watch"
`
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
    '-p, --profile "profileName"',
    'Use this profile, by name. NOTE: on Windows Terminal, it uses the profile settings (colors, fonts etc) BUT RUNS ON CURRENT DISTRO, for some esoteric Microsoft reason ;-('
  )
  .option('--debug', 'Enable debugging, outputs the command(s) before executing.')
  .action((cmds, options: TnewinOptions) => {
    if (debug || options.debug)
      console.log(
        'neWin DEBUG: executing commands',
        cmds.length,
        'commands:\n',
        cmds.join('\n')
      )

    if (!Array.isArray(cmds))
      throw new Error(`neWin Error: wrong cmds, should be an array: ${JSON.stringify(cmds)}`)

    if (cmds.length === 0) cmds.push('')

    // Windows Terminal: execute each one at once
    if (isWSL()) {
      for (const cmd of cmds) {
        const fullCommand = getFullCommand(cmd, options)
        if (debug || options.debug)
          console.debug('neWin(WSL) DEBUG: Executing single command:\n', fullCommand)
        exec(fullCommand, execCallback)
      }
    } else {
      // Konsole / Native linux: map & join cmds & execute all together
      const allFullCommands = cmds.map((cmd) => getFullCommand(cmd, options)).join('\n')
      if (debug || options.debug)
        console.debug('neWin(native) DEBUG: Executing all commands:\n', allFullCommands)

      exec(allFullCommands, execCallback)
      process.exit(0)
    }
  })
  .parse(process.argv)

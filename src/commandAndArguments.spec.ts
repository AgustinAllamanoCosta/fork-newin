/*
TnewinOptions:
  close: boolean
  echo: boolean
  color: string
  debug: boolean
  newTab: boolean
  profile: string
  resolvedDir: string
  separate: boolean
  title: string
  workdir: string
 */
import { getFullCommand, TnewinOptions } from './commandAndArguments'
import * as process from 'node:process'

describe('neWin', () => {
  describe.each(
    // prettier-ignore
    [
      ['ls', {}, `konsole --hold --show-tabbar --hide-menubar --workdir "." -e "ls" &`],
      ['npx foobar', {close: true}, `konsole --show-tabbar --hide-menubar --workdir "." -e "npx foobar" &`],
      ['npx foobar', {close: true, profile: 'Foo Profile'}, `konsole --profile "Foo Profile" --show-tabbar --hide-menubar --workdir "." -e "npx foobar" &`],
      ['npx foobar', {close: true, separate: true}, `konsole --separate --show-tabbar --hide-menubar --workdir "." -e "npx foobar" &`],
      ['npm run start:watch', {workdir: '~/project', close: true},
        `wt.exe --title "/project: $ start:watch" --suppressApplicationTitle bash -c "source /etc/environment && cd "~/project" && npm run start:watch && exec bash 2>&1"`, true],
      ['npm-run-all start:watch', {workdir: '~/project'},
        `wt.exe --title "/project: $ start:watch" --suppressApplicationTitle bash -c "source /etc/environment && cd "~/project" && npm-run-all start:watch && exec bash 2>&1"`, true],
      ['npm-run-all start:watch', {workdir: '/mnt', title: 'Foo Title'},
        `wt.exe --title "Foo Title" --suppressApplicationTitle bash -c "source /etc/environment && cd "/mnt" && npm-run-all start:watch && exec bash 2>&1"`, true],
    ]
  )('Works for', (cmd, options: TnewinOptions, expected, isWSL?: boolean) => {
    it(`${isWSL ? 'WSL' : 'Linux'}: '${cmd}' with options ${JSON.stringify(
      options
    )} becomes:\n$ ${expected}\n`, () => {
      process.env.WSL_INTEROP = isWSL ? 'WSL_INTEROP' : ''
      expect(getFullCommand(cmd, options)).toEqual(expected)
    })
  })
})

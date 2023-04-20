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
import { absolutePathRegExp, getFullCommand, TnewinOptions } from './commandAndArguments'
import * as process from 'node:process'

describe('neWin', () => {
  describe.each(
    // prettier-ignore
    [
      ['ls', {}, `konsole --hold --show-tabbar --hide-menubar --workdir "." -e "ls" &`],
      ['npx foobar', {close: true}, `konsole --show-tabbar --hide-menubar --workdir "." -e "npx foobar" &`],
      ['npx foobar', {
        close: true,
        profile: 'Foo Profile',
      }, `konsole --profile "Foo Profile" --show-tabbar --hide-menubar --workdir "." -e "npx foobar" &`],
      ['npx foobar', {
        close: true,
        separate: true,
      }, `konsole --separate --show-tabbar --hide-menubar --workdir "." -e "npx foobar" &`],
      ['npm run start:watch', {workdir: '~/project', close: true},
        `wt.exe -d "~/project" --title "/project: $ start:watch" --suppressApplicationTitle bash -c "source /etc/environment && npm run start:watch"`, true],
      ['npm-run-all start:watch', {workdir: '~/project'},
        `wt.exe -d "~/project" --title "/project: $ start:watch" --suppressApplicationTitle bash -c "source /etc/environment && npm-run-all start:watch"`, true],
      ['npm-run-all start:watch', {workdir: '/mnt', title: 'Foo Title'},
        `wt.exe -d "/mnt" --title "Foo Title" --suppressApplicationTitle bash -c "source /etc/environment && npm-run-all start:watch"`, true],
      ['', {workdir: '/mnt', title: 'Foo Title'},
        `wt.exe -d "/mnt" --title "Foo Title" --suppressApplicationTitle bash -c "source /etc/environment && exec bash 2>&1"`, true],
      ['npm-run-all start:watch', {
        workdir: 'A:/mnt/projects', title: 'Foo Title', mappedDrives: {
          a: {
            path: '\\\\wsl.localhost\\ubuntara',
          },
        },
      },
        `wt.exe -d "\\\\wsl.localhost\\ubuntara/mnt/projects" --title "Foo Title" --suppressApplicationTitle bash -c "source /etc/environment && npm-run-all start:watch"`, true],
      
      ['npm-run-all start:watch', {
        workdir: 'z:/mnt/projects', title: 'Foo Title', mappedDrives: {
          Z: {
            path: '\\\\wsl.localhost\\ubuntara',
          },
        },
      },
        `wt.exe -d "\\\\wsl.localhost\\ubuntara/mnt/projects" --title "Foo Title" --suppressApplicationTitle bash -c "source /etc/environment && npm-run-all start:watch"`, true],
    ],
  )('Works for', (cmd, options: TnewinOptions | any, expected: string, isWSLOrWindows?: boolean) => {
    it(`${isWSLOrWindows ? 'WSL' : 'Linux'}: '${cmd}' with options ${JSON.stringify(
      options,
    )} becomes:\n$ ${expected}\n`, () => {
      process.env.WSL_INTEROP = isWSLOrWindows ? 'WSL_INTEROP' : ''
      expect(getFullCommand(cmd, options)).toEqual(expected)
    })
  })
  
  describe.each(
    // prettier-ignore
    [
      ['/mnt', true],
      ['/mnt/projects', true],
      ['/mnt/projects', true],
      ['~', true],
      ['~/docs', true],
      ['~/more/docs', true],
      ['z:/', true],
      ['z:\\', true],
      ['z:/mnt', true],
      ['z:/mnt/projects', true],
      ['z:\\mnt\\projects', true],
      ['project', false],
      ['project/newin', false],
      ['project\\newin', false],
      ['./project/newin', false],
      ['./project\\newin', false],
      ['z\\project\\newin', false],
      ['.\\z\\project\\newin', false]
    ],
  )('absolutePathRegExp test', (path: string, isAbsolute:boolean) => {
    it(`${path} is ${isAbsolute ? 'absolute' : 'relative'}`, () => {
      expect(absolutePathRegExp.test(path)).toEqual(isAbsolute)
    })
  })
  
})

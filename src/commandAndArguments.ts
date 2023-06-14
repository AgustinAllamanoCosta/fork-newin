import * as process from 'node:process'
import { TnewinOptions } from 'types/types'
import * as upath from 'upath'

export const isWindows = () => process.platform === 'win32'
export const isWSL = () => !!process.env.WSL_INTEROP
export const isWSLOrWindows = () => isWindows() || isWSL()

const getWindowsArguments = (options: TnewinOptions, cmd: string): string => {
  const wtArgs = []
  if (options.newTab) wtArgs.push(isWSLOrWindows() ? `-w 0` : '--new-tab')

  if (options.profile) wtArgs.push(`--profile "${options.profile}"`)

  wtArgs.push(`-d "${options.resolvedDir}"`)

  // title handling
  if (!options.notitle) {
    let title = options.title
    if (!options.title && cmd) {
      // set to last path item + bash cmd while replacing "npm run", "npx " etc
      const lastPathItem = options.resolvedDir.split(isWindows() ? '\\' : '/').reverse()[0]
      cmd = ['npm run ', 'npm-run-all ', 'npx '].reduce(
        (acc, replaceMe) =>
          cmd.startsWith(replaceMe) ? acc.slice(replaceMe.length - 1) : acc,
        cmd
      )
      title = `/${lastPathItem}: $ ${cmd.trim()}`
    }
    if (title) wtArgs.push(`--title "${title}" --suppressApplicationTitle`)
  }

  // color
  if (options.color) {
    if (options.color[0] !== '#') options.color = `#${options.color}`

    wtArgs.push(`--tabColor "${options.color}"`)
  }

  const argsStr = wtArgs.join(' ')
  return argsStr ? `${argsStr} ` : ``
}

const getKonsoleArguments = (options: TnewinOptions): string => {
  const wtArgs = []
  if (options.newTab) wtArgs.push(isWSLOrWindows() ? `-w 0` : '--new-tab')

  if (options.profile) wtArgs.push(`--profile "${options.profile}"`)

  // Konsole only
  if (!options.close) wtArgs.push(`--hold`)
  if (options.separate) wtArgs.push(`--separate`)

  const argsStr = wtArgs.join(' ')
  return argsStr ? `${argsStr} ` : ``
}

export const getGnomeArguments = (options: TnewinOptions): string =>{
  const tabOrWindow: string = options.newTab? '--tab': '--window'
  const title: string = options.title? options.title : 'newin gnome'
  const workdir: string = options.workdir? options.workdir : '.'
  return  `${tabOrWindow} --title="${title}" --working-directory=${workdir}`
}

// paths starting with "driveLetter:\xxx" or Unix home "~" or Unix path "/xxx..."
export const absolutePathRegExp = /^(\w:[\\\/].*)|(^[~\/]\/?.*)/

export const getFullCommandWindows = (cmd, options: TnewinOptions): string => {

  if (!options.workdir) options.workdir = '.'
  let fullCommand
  const wtBashCmds = [`source /etc/environment`]
  options.resolvedDir = absolutePathRegExp.test(options.workdir)
    ? options.workdir
    : upath.resolve(process.cwd(), options.workdir)

  // replace "Z:/some/path" => "\\\\wsl.localhost\\ubuntara/some/path
  const driveLetters = Object.keys(options.mappedDrives || {})
  driveLetters.forEach(driveLetter => {
    const upperCaseDriveLetter = driveLetter.toUpperCase();
    const resolvedDirUpperCaseDriveLetter = options.resolvedDir[0].toUpperCase() + options.resolvedDir.slice(1)
    if (resolvedDirUpperCaseDriveLetter.startsWith(upperCaseDriveLetter + ':')) {
      options.resolvedDir = resolvedDirUpperCaseDriveLetter.replace(upperCaseDriveLetter + ':', options.mappedDrives[driveLetter].path)
    }
  })

  if (options.debug) {
    console.debug(
      `neWin(${isWSL() ? 'WSL' : 'Windows'}) DEBUG: options.resolvedDir =`,
      options.resolvedDir
    )
  }

  if (cmd) {
    if (options.echo)
      wtBashCmds.push(`echo '(newin ${isWSL() ? 'WSL' : 'Windows'}) $ ${cmd}'`)
    wtBashCmds.push(cmd) // execute cmd and quit
  } else wtBashCmds.push(`exec bash 2>&1`) // empty bash waiting for input, if no cmd is given

  fullCommand = `wt.exe ${getWindowsArguments(options, cmd)}bash -c "${wtBashCmds.join(' && ')}"`
  return fullCommand
}

export const getFullKonsoleCommand = (cmd, options: TnewinOptions): string => {
  if (!options.workdir) options.workdir = '.'

  const fullCommand = `konsole ${getKonsoleArguments(options)}--show-tabbar --hide-menubar --workdir "${options.workdir}" ${cmd ? '-e ' : ''}"${cmd}" &`
  return fullCommand
}

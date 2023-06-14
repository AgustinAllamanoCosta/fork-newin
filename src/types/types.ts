import * as networkDrive from 'windows-network-drive'

export type TnewinOptions = {
    close?: boolean
    echo?: boolean
    color?: string
    debug?: boolean
    newTab?: boolean
    profile?: string
    resolvedDir?: string
    separate?: boolean
    title?: string
    notitle?: boolean
    workdir?: string
    mappedDrives?: Awaited<ReturnType<typeof networkDrive.list>> // { driveLetter: string, path: string, ...}
  }

  export type TermianlStrategy = (cmd: string, options: TnewinOptions) => string
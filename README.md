# *neWin* - Open new Window(s) or Tab(s) on Windows Terminal or KDE Konsole and executes bash command(s).

Open new window(s)/tab(s) with a bash shell & execute the commands given. 

Works with KDE Konsole or Windows Terminal in WSL without any code changes or config.

Written in Nodejs/TypeScript, but it works for everyone.

## Motivation

I needed a powerful way to start tasks on new windows (or tabs) automatically, mainly from within my nodejs scripts.

For example, don't we all want to `npm run dev` to start an API server AND its integration tests, but on 2 separate windows? In a tiny line of code?

I needed it to be: 
 
- without external bash scripts like I used to crack the problem, but straight from package.json.

- laconic, with sane defaults

- powerful, able to open multiple windows and run multiple commands and set a meaningful title. 

- portable, at least on Linux KDE & Windows Terminal, with no code/package changes.  

Unfortunately, it's much more complicated that one would think in 2023. I found [wttab](https://github.com/lalilaloe/wttab) & [ttab](https://github.com/mklement0/ttab but none was good for my case. I was actually inspired and based initial code on [wttab](https://github.com/lalilaloe/wttab). Unfortunately as it was M$ Windows-only, it wasn't possible to use it in a dual Windows/native linux as-is, and also there were some other breaking issues.

The *neWin* in comparison is:

* Same command works on both WSL and native linux - keeps you package.json scripts consistent.

* Multiple commands can be executed, each opening in a new window! So in your package.json's scripts you can have 

``` package.json
    scripts:
      "dev": "newin 'npm run start:watch' 'npm run test:watch'"
```

to start a development API server & the integration tests on separate windows, in the most terse way ;-)

* Simplified codebase in TypeScript, where PowerShell is discarded (cause it's too complicated & mostly useless) and KDE Konsole for native linux usage is added instead. Easier and more useful in my case, take your pick. I don't care about powershell, since WSL works perfectly. In the future I'd love *neWin* to just support all of *Nix (Macs & other Linux consoles).

## Install

`npm install -g newin`

On WSL:

* Make sure you have [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab) installed.

* Make sure `$WSL_INTEROP` env variable is set and it's working (i.e you should be able to execute "$ wt.exe" etc on your WSL shell)

## Usage

```
╰─$ newin --help          
Usage: newin [options] [cmds...]

Opens multiple new windows/tabs on KDE Konsole or Windows Terminal (WT) & execute given bash command(s).

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
  

Options:

  -d --workdir <workdir>       Specify working directory of new window. It is relative to
                               CWD, unless it starts with '/' or '~' where it becomes
                               absolute. Default is CWD. (default: ".")
  -n, --new-tab                Open a new Tab instead of a new Window. Default is new
                               Window.
  -t, --title <title>          (WT Only) Specify title for new Window/Tab. It suppresses native app titles.
  
  It defaults to <lastPath>: $ <bashCmd>
  
  A nodejs specific tweek is that if a bash command starts with "npm run", "npm-run-all" or "npx", these are removed!
  
  Eg $ newin  --workdir '~/project' 'npm run start:watch'
  
  gives rise to the title "/project: $ start:watch"
  
  -o --notitle                 Leave the title alone!
  -c --color <hexcode>         (WT Only) Set color of Tab.
  -e --echo                    (WT Only) Echo bash command before executing.
  -l --close                   (Konsole only) Close the initial session automatically when
                               it ends (Konsole executed by default with --hold).
  -s --separate                (Konsole only) Run the new instance of Konsole in a
                               separate process.
  -p, --profile "profileName"  Use this profile, by name. NOTE: on Windows Terminal, it
                               uses the profile settings (colors, fonts etc) BUT RUNS ON
                               CURRENT DISTRO, for some esoteric Microsoft reason ;-(
  --debug                      Enable debugging, outputs the command(s) before executing.
  -h, --help                   display help for command
```

## Contributing

Help to improve *neWin* is absolutelly welcome! Please open an issue if you have issues or suggestions. 

Most of all, as I have no time or way to support other distros / platforms, it would be great if someone can implement the MacOS and other Linux consoles (eg gnome-terminal). PRs (with tests) are mostly welcome. 

## References 

Commands taken from [Official Windows Terminal docs](https://docs.microsoft.com/nl-nl/windows/terminal/command-line-arguments?tabs=linux) & [https://docs.kde.org/trunk5/en/konsole/konsole/command-line-options.html](https://docs.kde.org/trunk5/en/konsole/konsole/command-line-options.html)

Copyright (c) 2023 Angelos Pikoulas

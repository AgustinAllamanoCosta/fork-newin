export const DESCRIPTION: string = `Opens multiple new windows/tabs on KDE Konsole or Windows Terminal (WT) & execute given bash command(s).

* Works as-is from either WSL linux shell or a native Linux KDE konsole shell!

* It uses the default Konsole / WT Profile.

* It uses a workdir relative to CWD or an absolute dir.

* On WSL, it always calls "source /etc/environment" to set the correct path and environment variables.

Notes:

* On WSL, make sure $WSL_INTEROP variable is set and working (i.e you should be able to execute "$ wt.exe" etc on your WSL shell)

* On Linux Konsole, DONT use multiple bash commands for each window, as it fails in various ways (it's Konsole's fault as far as I can dig, please help if you know better). For example DONT USE $ newin "ls & npm -v". Opening in multiple windows (eg $ newin "ls" "npm -v") works as expected!

Examples:

  $ newin                                          # opens a new window on CWD

  $ newin -workdir /mnt/projects                   # opens a new window on an absolute path on WSL (/mnt/projects in this case)
  $ newin -workdir ~/projects                      # opens a new window on an absolute path on WSL (~/projects in this case)
  
  $ newin -workdir z:/projects                     # opens a new window on a Windows absolute path (z:/projects in this case).
                                                   # It is correctly translated when called from Windows, if the drive letter is mapped to a WSL Linux instance (eg Z: mapped to \\\\wsl.localhost\Ubuntu)

  $ newin -workdir projects                        # opens a new window on ./projects, relative to CWD
  $ newin -workdir ./projects                      #                  same ^

  $ newin 'npm -v' 'node -v'                       # execute 'npm -v' on a new window and 'node -v' on another one.

  $ newin -p 'Ubuntu-20.04'                        # use this profile name. NOTE: in current distro only - see below.

  $ newin --color AF3 --title foo "node -v"

  $ newin --color AF3 --title 'ZenDash: test:watch' --workdir 'projects/devzen/packages/zendash' 'node -v'

Note: Commands that are (Konsole only) or (WT Only) are ignored on the other environment.
`

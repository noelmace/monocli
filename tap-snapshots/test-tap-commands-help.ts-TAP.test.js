/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/tap/commands/help.ts TAP > add 1`] = `
Usage: monocli add <path> [options]

add, convert or import a project

<path>   path to the project directory

Behavior depends on what the <path> directory contains and if you provided an [url] or not:
  - if <path> is a submodule, it will be converted to a "subproject"
  - if --url is provided, the associated repository will be imported (overriding any pre-existing submodule)
  - finally, the project's data will be added to the configuration

Options:
  --scope       <string>   conventional commit scope  (default: path basename)
  --rewrite     <boolean>  rewrite subproject history before merge  (default: false)
  --branch      <string>   name of the branch were all modifications to the remote subtree repository will be made and push  (default: monocli-add-<scope>)
  --url         <string>   subrepo origin url  (default: from submodule)
`

exports[`test/tap/commands/help.ts TAP > check 1`] = `
Usage: monocli check <directory> [options]

check if <directory> has changed since a release

fails (non zero exit code) if the last commit including changes in <directory> is behind the specified (or latest semver) tag

useful for release scripts and incremental builds


Options:
  --tag         <string>   tag name to check against  (default: latest semver compliant tag name)
`

exports[`test/tap/commands/help.ts TAP > help 1`] = `
Usage: monocli help [command name] 

display usage info

If supplied a command name, then show the associated documentation.
    
If the command name is not provided, or does not exist, then show the main documentation.
`

exports[`test/tap/commands/help.ts TAP > main 1`] = `
Usage: monocli <command> [options]

One CLI to rule them all.

Easy monorepos management, and more.

Commands: status, mv, help, update, spush, spull, check, add, rm

Use 'monocli help <command name>' for more information about one of these commands.

Options:
  --debug       <boolean>  enable debug mode (set log level to "silly")  (default: false)
  --trust       <boolean>  run non-interactively (by default answer to all prompts)  (default: false)
`

exports[`test/tap/commands/help.ts TAP > mv 1`] = `
Usage: monocli mv <path> <new-path> 

change a subtree prefix
This command requires that <path> is associated with a existing project.

⚠️  Experimental command  ⚠️
`

exports[`test/tap/commands/help.ts TAP > rm 1`] = `
Usage: monocli rm <path> 

delete a subproject
delete the <path> directory along with the related submodule and the monocli subproject configurations if needed
`

exports[`test/tap/commands/help.ts TAP > spull 1`] = `
Usage: monocli spull [directory] [options]

update (pull) [directory] subtree from a remote repo
To run this command on every project defined in monocli.json with a remote url, just leave the [directory] argument blank (the --url option will be ignored in this case)

Options:
  --url         <string>   url of the subtree remote  (default: from config if exists)
  --branch      <string>   name of the destination branch in the subtree remote  (default: "master")
`

exports[`test/tap/commands/help.ts TAP > spush 1`] = `
Usage: monocli spush [directory] [options]

update (push to) the remote "subtree" repo associated to [directory]
To run this command on every project defined in monocli.json with a remote url, just leave the [directory] argument blank (the --url option will be ignored in this case)

Options:
  --force       <boolean>  Force push (with lease) to the remote repository. Use with caution!  (default: false)
  --url         <string>   url of the subtree remote  (default: from config if exists)
  --branch      <string>   name of the destination branch in the subtree remote  (default: "master")
`

exports[`test/tap/commands/help.ts TAP > status 1`] = `
Usage: monocli status  

show the monorepo status
include git status and details about the monorepo state and config
`

exports[`test/tap/commands/help.ts TAP > unknown command name 1`] = `
Usage: monocli <command> [options]

One CLI to rule them all.

Easy monorepos management, and more.

Commands: status, mv, help, update, spush, spull, check, add, rm

Use 'monocli help <command name>' for more information about one of these commands.

Options:
  --debug       <boolean>  enable debug mode (set log level to "silly")  (default: false)
  --trust       <boolean>  run non-interactively (by default answer to all prompts)  (default: false)
`

exports[`test/tap/commands/help.ts TAP > update 1`] = `
Usage: monocli update [directory] [options]

update the subtree associated to [directory]
Tries to run the spush command, and retry after a spull if it failed.

To run this command on every project defined in monocli.json with a remote url, just leave the [directory] argument blank (the --url option will be ignored in this case)

Options:
  --url         <string>   url of the subtree remote  (default: from config if exists)
  --branch      <string>   name of the destination branch in the subtree remote  (default: "master")
`

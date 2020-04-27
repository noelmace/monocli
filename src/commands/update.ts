import * as log from "npmlog";
import { MonorepoCommand } from "../models/monorepo-command";
import { CommandDocumentation } from "../models/documentation";
import { cmdOption, CommandOptionConfig } from "../models/options";
import { runCommand } from "../utils/command";

export class UpdateCommand extends MonorepoCommand {
  protected doc: CommandDocumentation = {
    name: `update`,
    usage: `<directory> [url] [branch]`,
    description: `update (push) the subtree associated to <directory>`,
    details: `alias of the spush command with --force and --branch=master`,
    // TODO: extend Spush options
    options: new Map<string, CommandOptionConfig>()
  };

  async run(
    [directory, url, branch]: [string, string, string],
    options: Map<string, cmdOption> = new Map()
  ): Promise<string | void> {
    const remoteBranch = branch || `master`;
    const spushOptions = new Map<string, cmdOption>([...options.entries()]);
    try {
      spushOptions.set(`force`, false);
      await runCommand(`spush`, [directory, url, remoteBranch], spushOptions);
    } catch (e) {
      log.warn(`spush`, `push to subtree remote failed`);
      log.notice(`spull`, `pulling from subtree remote`);
      await runCommand(`spull`, [directory, url, remoteBranch]);
      await runCommand(`spush`, [directory, url, remoteBranch], spushOptions);
    }
    log.notice(directory, `updated`);
  }
}

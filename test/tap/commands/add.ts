import * as path from "path";
import * as t from "tap";
import * as fs from "fs-extra";
import * as prompts from "prompts";
import { testDir, makeGitRepo, run, graphLog } from "../../common";
import { AddCommand } from "../../../src/commands";
import { buildCommand } from "../../../src/utils/build-command";
import { Repository } from "../../../src/models/git";
import { CommandOptionError } from "../../../src/models/errors";
import { SubProjectConfig } from "../../../src/models/config";
import { Monorepo } from "../../../src/models/monorepo";
import { getProject } from "../../../src/utils/config";

async function setupMonorepo(id: string): Promise<Repository> {
  const root = path.resolve(testDir, `prepare-submodule`, id);
  const monoDir = path.resolve(root, `mono`);
  await fs.mkdirp(monoDir);
  fs.writeFileSync(
    path.resolve(monoDir, Monorepo.CONFIG_FILE_NAME),
    JSON.stringify({ projects: [] })
  );
  const monorepo = await makeGitRepo({
    root: monoDir,
    added: [Monorepo.CONFIG_FILE_NAME]
  });

  return monorepo;
}

async function setupRemoteProject(monorepo: Repository): Promise<Repository> {
  const root = path.resolve(monorepo.path, `..`);
  const subrepoDir = path.resolve(root, `sub`);
  await fs.mkdirp(subrepoDir);
  await fs.createFile(path.resolve(subrepoDir, `foo.txt`));

  return makeGitRepo({
    root: subrepoDir,
    added: [`foo.txt`]
  });
}

async function setupSubmodule(
  monorepo: Repository,
  url: string
): Promise<string> {
  const directory = path.join(`packages`, `subproject`);

  await monorepo.git(`submodule`, [
    `add`,
    `--name`,
    `subproject`,
    url,
    directory
  ]);

  await monorepo.git(`commit`, [`-am`, `submodule`]);

  return directory;
}

t.test(`add command`, async t => {
  await t.test(`prepareSubmodule()`, async t => {
    t.test(`with submodule`, async t => {
      t.test(`without url option`, async t => {
        const monorepo = await setupMonorepo(`sub-no-url`);
        const remoteRepo = await setupRemoteProject(monorepo);
        const submoduleDirectory = await setupSubmodule(
          monorepo,
          remoteRepo.path
        );
        const cmd = buildCommand(`add`, monorepo.path) as AddCommand;

        const { urls, isSubmodule } = await cmd.prepareSubmodule(
          submoduleDirectory,
          ``
        );

        t.equal(
          urls?.clone,
          path.resolve(monorepo.path, submoduleDirectory),
          `clone url point to submodule directory`
        );
        t.equal(
          urls?.remote,
          remoteRepo.path,
          `remote url point to submodule url`
        );
        t.equal(isSubmodule, true, `submodule detected`);
        t.true(
          fs.existsSync(
            path.resolve(monorepo.path, submoduleDirectory, `foo.txt`)
          ),
          `submodule was updated`
        );
      });

      t.test(`with url option`, async t => {
        const monorepo = await setupMonorepo(`sub-with-url`);
        const remoteRepo = await setupRemoteProject(monorepo);
        const submoduleDirectory = await setupSubmodule(
          monorepo,
          remoteRepo.path
        );
        const cmd = buildCommand(`add`, monorepo.path) as AddCommand;
        const randomUrl = `/foo/bar/baz`;

        const { urls, isSubmodule } = await cmd.prepareSubmodule(
          submoduleDirectory,
          randomUrl
        );

        t.equal(urls?.clone, randomUrl, `clone url equals url option`);
        t.equal(urls?.remote, randomUrl, `remote url equals url option`);
        t.equal(isSubmodule, false, `no submodule detected`);
        const submodules = await monorepo.getSubmodules();
        t.equals(submodules.size, 0, `should delete the submodule`);
      });
    });

    t.test(`without submodule`, async t => {
      t.test(`without url option`, async t => {
        const monorepo = await setupMonorepo(`no-url`);
        const directory = path.join(`packages`, `subproject`);
        const cmd = buildCommand(`add`, monorepo.path) as AddCommand;

        const { urls, isSubmodule } = await cmd.prepareSubmodule(directory, ``);

        t.equal(urls, null, `no urls`);
        t.equal(isSubmodule, false, `no submodule detected`);
        t.true(
          fs.existsSync(path.resolve(monorepo.path, directory, `.gitkeep`))
        );
      });

      t.test(`with url option`, async t => {
        const monorepo = await setupMonorepo(`with-url`);

        const directory = path.join(`packages`, `subproject`);

        const cmd = buildCommand(`add`, monorepo.path) as AddCommand;
        const randomUrl = `/foo/bar/baz`;

        const { urls, isSubmodule } = await cmd.prepareSubmodule(
          directory,
          randomUrl
        );

        t.equal(urls?.clone, randomUrl, `clone url equals url option`);
        t.equal(urls?.remote, randomUrl, `remote url equals url option`);
        t.equal(isSubmodule, false, `no submodule detected`);

        const submodules = await monorepo.getSubmodules();
        t.equals(submodules.size, 0, `should delete the submodule`);
      });
    });
  });

  await t.test(`checkProject()`, async t => {
    const repo = await setupMonorepo(`check-project`);
    const config: SubProjectConfig = {
      directory: `packages/foo`,
      scope: `foo`
    };
    const monorepo = new Monorepo(repo.path);
    await monorepo.addProjectConfig(config);
    const cmd = buildCommand(`add`, repo.path) as AddCommand;

    t.rejects(
      cmd.checkProject(config.directory),
      new CommandOptionError(
        `directory`,
        `a project was already added for this directory`
      )
    );
  });

  // TODO: mvFiles()
  // TODO: rewriteHistory()

  await t.test(`run()`, async t => {
    await t.test(`with submodule`, async t => {
      await t.test(`without url option`, async t => {
        const monorepo = await setupMonorepo(`run-sub-no-url`);
        const remoteRepo = await setupRemoteProject(monorepo);
        const submoduleDirectory = await setupSubmodule(
          monorepo,
          remoteRepo.path
        );
        const output = await run([`add`, submoduleDirectory], monorepo.path);
        t.matchSnapshot(output, `output`);
        t.matchSnapshot(await graphLog(monorepo), `commits`);
      });

      await t.test(`with url option`, async t => {
        const monorepo = await setupMonorepo(`run-sub-with-url`);
        const remoteRepo = await setupRemoteProject(monorepo);
        const submoduleDirectory = await setupSubmodule(
          monorepo,
          remoteRepo.path
        );
        const output = await run(
          [`add`, submoduleDirectory, remoteRepo.path],
          monorepo.path
        );
        t.matchSnapshot(output, `output`);
        t.matchSnapshot(await graphLog(monorepo), `commits`);
      });
    });

    await t.test(`empty`, async t => {
      const monorepo = await setupMonorepo(`run-empty`);
      const config: SubProjectConfig = {
        directory: `packages/foo`,
        scope: `test`
      };
      const output = await run(
        [`add`, config.directory, `--scope`, config.scope],
        monorepo.path
      );
      t.matchSnapshot(output, `output`);
      t.matchSnapshot(await graphLog(monorepo));
      t.true(
        fs.existsSync(path.resolve(monorepo.path, config.directory, `.gitkeep`))
      );
      const projectConfig = getProject(
        new Monorepo(monorepo.path).getConfig(),
        `directory`,
        config.directory
      );
      t.same(projectConfig, config, `project config`);
    });

    await t.test(`remote`, async t => {
      const monorepo = await setupMonorepo(`run-remote`);
      const remoteRepo = await setupRemoteProject(monorepo);

      const config = {
        directory: `packages/foo`,
        scope: `test`,
        url: remoteRepo.path
      };

      const output = await run(
        [`add`, config.directory, config.url, `--scope`, config.scope],
        monorepo.path
      );

      t.matchSnapshot(output, `output`);
      t.matchSnapshot(await graphLog(monorepo), `commits`);

      t.true(
        fs.existsSync(path.resolve(monorepo.path, config.directory, `foo.txt`)),
        `subproject files`
      );

      const projectConfig = getProject(
        new Monorepo(monorepo.path).getConfig(),
        `directory`,
        config.directory
      );

      t.same(projectConfig, config, `project config`);
    });

    await t.test(`rewrite`, async t => {
      const monorepo = await setupMonorepo(`run-rewrite`);
      const remoteRepo = await setupRemoteProject(monorepo);

      const config = {
        directory: `packages/foo`,
        scope: `test`,
        url: remoteRepo.path
      };

      prompts.inject([true, true]);

      const output = await run(
        [
          `add`,
          config.directory,
          config.url,
          `--scope`,
          config.scope,
          `--rewrite`
        ],
        monorepo.path
      );

      t.matchSnapshot(output, `output`);
      t.matchSnapshot(await graphLog(monorepo), `commits`);

      t.true(
        fs.existsSync(path.resolve(monorepo.path, config.directory, `foo.txt`)),
        `subproject files`
      );

      const projectConfig = getProject(
        new Monorepo(monorepo.path).getConfig(),
        `directory`,
        config.directory
      );

      t.same(projectConfig, config, `project config`);
    });
  });
});
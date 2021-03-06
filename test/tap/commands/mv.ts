import * as path from "path";
import * as fs from "fs-extra";
import * as t from "tap";
import { makeGitRepo, testDir, run, TestRepo, graphLog } from "../../common";
import { Config } from "../../../src/models/config";
import { Monorepo } from "../../../src/models/monorepo";

const config: Config = {
  projects: [
    {
      scope: `one`,
      directory: `one`
    },
    {
      scope: `two`,
      directory: `two`
    }
  ]
};

async function setup(id: string, remoteUrl?: string): Promise<TestRepo> {
  const root = path.resolve(testDir, id);
  await fs.mkdir(root);

  if (remoteUrl) {
    config.projects[0].url = remoteUrl;
  }

  await fs.writeFile(
    path.resolve(root, Monorepo.CONFIG_FILE_NAME),
    JSON.stringify(config, null, 2)
  );

  const repo = await makeGitRepo({ root, added: [Monorepo.CONFIG_FILE_NAME] });

  await fs.createFile(path.resolve(root, `one/foo.txt`));
  await repo.git(`add`, [`one/foo.txt`]);
  await repo.git(`commit`, [`-m`, `feat(one): foo.txt`]);
  await fs.createFile(path.resolve(root, `two/bar.txt`));
  await repo.git(`add`, [`two/bar.txt`]);
  await repo.git(`commit`, [`-m`, `feat(two): bar.txt`]);

  return { repo, path: root };
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
t.test(`mv command`, async t => {
  await t.test(`without remote`, async t => {
    const testRepo = await setup(`no-remote`);

    const output = await run([`mv`, `one`, `three`], testRepo.path);
    const commits = await testRepo.repo.git(`log`, [`--format=%B`]);

    t.matchSnapshot(commits, `commits`);
    t.matchSnapshot(output, `output`);
    t.equal(
      await fs.pathExists(path.resolve(testRepo.path, `one`)),
      false,
      `remove old folder`
    );
    t.same(
      await fs.pathExists(path.resolve(testRepo.path, `three`, `foo.txt`)),
      true,
      `move to new folder`
    );
    t.matchSnapshot(
      fs.readFileSync(
        path.resolve(testRepo.path, Monorepo.CONFIG_FILE_NAME),
        `utf8`
      ),
      `updated config`
    );
  });

  await t.test(`with remote`, async t => {
    const remote = path.resolve(testDir, `push-remote`);
    await fs.mkdir(remote);

    await makeGitRepo({ root: remote, bare: true });
    const testRepo = await setup(`push`, remote);
    await run([`spush`, config.projects[0].directory], testRepo.path);

    const output = await run(
      [
        `mv`,
        config.projects[0].directory,
        `new-${config.projects[0].directory}`
      ],
      testRepo.path
    );
    t.matchSnapshot(output, `output`);

    t.matchSnapshot(await graphLog(testRepo.repo));
  });
});

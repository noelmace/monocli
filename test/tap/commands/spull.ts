import * as path from "path";
import * as t from "tap";
import * as fs from "fs-extra";
import {
  makeGitRepo,
  testDir,
  commitNewFile,
  cleanSnapshot,
  graphLog,
  run
} from "../../common";
import { Repository } from "../../../src/models/git";

async function setup(
  directory: string
): Promise<{ monorepo: Repository; remote: Repository }> {
  const remote = await makeGitRepo({
    root: path.resolve(testDir, `remote`),
    bare: true
  });
  await commitNewFile(remote, `README.md`, `docs: add README before add`);
  const monodir = path.resolve(testDir, `mono`);
  await fs.mkdirp(monodir);
  fs.createFileSync(path.resolve(monodir, `mono.cool`));
  const monorepo = await makeGitRepo({
    root: path.resolve(testDir, `mono`),
    added: [`mono.cool`],
    message: `initial commit`
  });
  await run([`add`, directory, `--url`, remote.path], monorepo.path);
  await commitNewFile(remote, `foo.txt`, `feat: add file after add`);

  return {
    monorepo,
    remote
  };
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
t.test(`spull command`, async t => {
  const directory = `packages/foo`;
  const { monorepo, remote: remoteRepo } = await setup(directory);
  const output = await run(
    [`spull`, directory, `--url`, remoteRepo.path],
    monorepo.path
  );

  t.matchSnapshot(cleanSnapshot(output), `output`);
  t.matchSnapshot(cleanSnapshot(await graphLog(monorepo)), `commits`);
});

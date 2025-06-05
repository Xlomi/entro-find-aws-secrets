import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';
import { matchSecrets } from './matcher.service';


export interface SecretFinding {
  secret: string;
  file: string;
  line: number;
  commit: string;
  author: string;
}

export async function scanRepo(repoUrl: string): Promise<SecretFinding[]> {
  const tmpDir = path.join(os.tmpdir(), `repo-${Date.now()}`);
  console.log(`tmpDir: ${tmpDir}`);
  const git: SimpleGit = simpleGit();

  console.log(`Cloning repo: ${repoUrl}`);
  await git.clone(repoUrl, tmpDir);
  console.log(`Cloned repo: ${tmpDir}`);

  const repo = simpleGit(tmpDir);
  const log = await repo.log({ '--no-merges': null });
  const commits = log.all;

  const findings: SecretFinding[] = [];

  for (const commit of commits) {
    const diff = await repo.show([commit.hash]);

    const matches = matchSecrets(diff);
    for (const { matched } of matches) {
      console.log(`Found secrets in commit ${commit.hash}: ${matched.join(', ')}`);
      findings.push({
        secret: matched.join(', '),
        file: 'unknown', // TODO: get file name from diff
        line: -1, // TODO: get line number from diff
        commit: commit.hash,
        author: commit.author_email,
      });
    }
  }

  await fs.remove(tmpDir);
  return findings;
}

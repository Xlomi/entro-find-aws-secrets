import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import simpleGit, { SimpleGit, DefaultLogFields } from 'simple-git';

export interface SecretFinding {
  secret: string;
  file: string;
  line: number;
  commit: string;
  author: string;
}

export async function scanRepo(repoUrl: string): Promise<SecretFinding[]> {
  const tmpDir = path.join(os.tmpdir(), `repo-${Date.now()}`);
  const git: SimpleGit = simpleGit();

  console.log(`Cloning repo: ${repoUrl}`);
  await git.clone(repoUrl, tmpDir);

  const repo = simpleGit(tmpDir);
  const log = await repo.log({ '--no-merges': null });
  const commits = log.all;

  const findings: SecretFinding[] = [];

  for (const commit of commits) {
    const diff = await repo.show([commit.hash]);

    // TODO: Replace this with secret matching logic
    if (diff.includes('+')) {
      findings.push({
        secret: 'AKIAEXAMPLE1234567890',
        file: 'src/index.js',
        line: 12,
        commit: commit.hash,
        author: commit.author_email,
      });

      break;
    }
  }

  await fs.remove(tmpDir);
  return findings;
}

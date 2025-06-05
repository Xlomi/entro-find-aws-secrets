import { scanRepo } from './services/scanner.service';

const repo = 'https://github.com/trufflesecurity/trufflehog.git';

(async () => {
  console.log(`Scanning repo: ${repo}...\n`);
  const findings = await scanRepo(repo);

  console.log(`\nFound ${findings.length} findings:\n`);
  for (const f of findings) {
    console.log(`- Secret: ${f.secret}`);
    console.log(`  Commit: ${f.commit}`);
    console.log(`  Author: ${f.author}`);
    console.log(`  File:   ${f.file}`);
    console.log(`  Line:   ${f.line}`);
    console.log('---');
  }
})();

import { scanRepo } from './services/scanner.service';

const repo = 'https://github.com/Xlomi/entro-find-aws-secrets.git';
// Adding here a sample secret to see if the app finds it
// This should be found by the "AKIA" check: AKIA1EXAMPLEKEY12
// This should be found by the "AWS Secret Access Key" check: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

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

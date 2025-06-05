# AWS Secrets Scanner

This tool scans a public Git repo and looks for AWS credentials in the commit history.

Right now it works as a script — no server or API.

---

## Setup

```bash
npm install
```

---

## Run it

Use this command to scan a repo:

```bash
npx ts-node src/test-scan.ts
```

If you want to scan a different repo, open `test-scan.ts` and change the `repo` URL.
By default the URL points to itself, and it has 2 lines that should be found by the scan:

```
// This should be found by the "AKIA" check: AKIA1EXAMPLEKEY12
// This should be found by the "AWS Secret Access Key" check: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
---

## What it finds

- AWS Access Keys (like `AKIA...`)
- AWS Secret Keys (40-character base64-looking strings)

It scans only added lines in commits (no deletes, no merges).

---

## Known limitations

- Many false positives most likely internal git strings that look like a secret
- Doesn’t track exact filenames or line numbers yet - TODO
- Only works on public GitHub HTTPS repos

---

## Output

Results are printed to the terminal. Each one includes:
- Secret value
- Commit hash
- Author email

---

## Example

```text
Scanning repo: https://github.com/example/repo

Found 2 findings:

- Secret: AKIAIOSFODNN7EXAMPLE
  Commit: 123abc456def
  Author: xlomi@example.com
---
- Secret: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  Commit: 456def789ghi
  Author: shlomi@example.com
---
```

---

That’s it :-)

const accessKeyIdRegex = /AKIA[0-9A-Z]{16}/g; // TODO: I saw some options with ASIA. Need to check
const secretAccessKeyRegex =
  /(?:aws.*secret.*access.*key[^a-zA-Z0-9]{0,5})?['":= ]?([0-9a-zA-Z/+]{40})/i;

export interface MatchResult {
  line: string;
  matched: string[];
  lineNumber: number;
  file: string;
}

export function matchSecrets(diff: string): MatchResult[] {
  const results: MatchResult[] = [];

  const lines = diff.split('\n');
  let currentFile = '';
  let currentLineNumber = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();

    // Find the file header
    if (raw.startsWith('+++ b/')) {
      currentFile = raw.replace('+++ b/', '').trim();
      continue;
    }

    // Find a hunk header like "@@ -a,b +c,d @@"
    if (raw.startsWith('@@')) {
      const match = raw.match(/\+(\d+)/);
      currentLineNumber = match ? parseInt(match[1], 10) - 1 : 0;
      continue;
    }

    if (raw.startsWith('+') && !raw.startsWith('+++')) {
      currentLineNumber++;

      const line = raw.slice(1).trim();
      if (line === '') continue;

      const matches: string[] = [];

      const accessKeys = line.match(accessKeyIdRegex);
      if (accessKeys) matches.push(...accessKeys);

      const secretMatch = secretAccessKeyRegex.exec(line);
      if (secretMatch && secretMatch[1]) {
        matches.push(secretMatch[1]);
      }

      if (matches.length > 0) {
        results.push({
          line,
          matched: matches,
          lineNumber: currentLineNumber,
          file: currentFile || 'unknown',
        });
      }
    }
  }

  return results;
}

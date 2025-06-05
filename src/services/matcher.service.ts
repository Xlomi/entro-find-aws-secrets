const accessKeyIdRegex = /AKIA[0-9A-Z]{16}/g; // TODO: I saw some options with ASIA. Need to check
const secretAccessKeyRegex =
  /(?:aws.*secret.*access.*key[^a-zA-Z0-9]{0,5})?['":= ]?([0-9a-zA-Z/+]{40})/i;

export interface MatchResult {
  line: string;
  matched: string[];
}

export function matchSecrets(diff: string): MatchResult[] {
  const results: MatchResult[] = [];

  const lines = diff
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'));

  for (const raw of lines) {
    const line = raw.trim(); // Avoid checking empty lines
    if (line === '') continue;
    const matches: string[] = [];

    const accessKeys = line.match(accessKeyIdRegex);
    if (accessKeys) matches.push(...accessKeys);

    const secretMatch = secretAccessKeyRegex.exec(line);
    if (secretMatch && secretMatch[1]) {
      matches.push(secretMatch[1]);
    }

    if (matches.length > 0) {
      results.push({ line, matched: matches });
    }
  }

  return results;
}

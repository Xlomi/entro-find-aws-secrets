const accessKeyIdRegex = /AKIA[0-9A-Z]{16}/g; // TODO: I saw some options with ASIA. Need to check
const secretAccessKeyRegex = /[0-9a-zA-Z/+]{40}/g; // TODO: Found this regex in several blogs but I think it is too simplistic maybe need to add more checks

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

    const secretKeys = line.match(secretAccessKeyRegex);
    if (secretKeys) matches.push(...secretKeys);

    if (matches.length > 0) {
      results.push({ line, matched: matches });
    }
  }

  return results;
}

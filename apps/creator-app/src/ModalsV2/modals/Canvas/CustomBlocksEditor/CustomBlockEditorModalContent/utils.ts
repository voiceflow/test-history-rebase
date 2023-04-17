const CUSTOM_BLOCK_VAR_REGEX = /{[A-Z_a-z]\w*}/g;

const stripCurlyBraces = (token: string) => token.slice(1, token.length - 1);

export const inferVariableNames = (json: string): string[] => {
  const matches = [...json.matchAll(CUSTOM_BLOCK_VAR_REGEX)];
  const varNames = matches.map(([matchedToken]) => stripCurlyBraces(matchedToken));
  return Array.from(new Set(varNames));
};

const blacklistedTokens: Set<string> = new Set();

export function addToBlackList(token: string, expiryInSeconds?: number) {
  blacklistedTokens.add(token);
  if (expiryInSeconds) {
    setTimeout(() => blacklistedTokens.delete(token), expiryInSeconds * 1000);
  }
}

export function isBlacklisted(token: string): boolean {
  return blacklistedTokens.has(token);
}

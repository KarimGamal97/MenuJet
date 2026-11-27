let publicDataVersion = 1;

export function getPublicDataVersion(): number {
  return publicDataVersion;
}

export function invalidatePublicDataCaches(): void {
  publicDataVersion += 1;
}

export const getLatestVersion = (versions: Record<any, string | number>): number =>
  Math.max(...Object.values(versions).filter((version): version is number => typeof version === 'number'));

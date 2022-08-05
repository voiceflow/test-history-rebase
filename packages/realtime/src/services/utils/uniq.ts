// TODO: move this to @voiceflow/common

// get unique elements of array from right to left (last element wins)
export const uniqueReverse = <T, K>(items: T[], key: (item: T) => K): T[] => {
  const uniqList = new Map<K, T>();
  items.forEach((item) => uniqList.set(key(item), item));
  return [...uniqList.values()];
};

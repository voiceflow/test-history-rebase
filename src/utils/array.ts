export const without = <T>(items: T[], index: number) => (index === -1 ? items : [...items.slice(0, index), ...items.slice(index + 1)]);

export const withoutValue = <T>(items: T[], value: T) => without(items, items.indexOf(value));

export const replace = <T>(items: T[], index: number, item: T) => [...items.slice(0, index), item, ...items.slice(index + 1)];

export const insert = <T>(items: T[], index: number, item: T) => [...items.slice(0, index), item, ...items.slice(index)];

export const insertAll = <T>(items: T[], index: number, additionalItems: T[]) => [
  ...items.slice(0, index),
  ...additionalItems,
  ...items.slice(index),
];

export const append = <T>(items: T[], item: T) => (items.includes(item) ? items : [...items, item]);

export const toggleMembership = <T>(items: T[], item: T) => (items.includes(item) ? withoutValue(items, item) : [...items, item]);

export const head = <T>(items: T[]): [T, T[]] => {
  const [first, ...rest] = items;
  return [first, rest];
};

export const reorder = <T>(items: T[], fromIndex: number, toIndex: number) => {
  if (fromIndex < 0 || fromIndex >= items.length) {
    return items;
  }

  if (toIndex < 0) {
    return [items[fromIndex], ...without(items, fromIndex)];
  }

  if (toIndex >= items.length) {
    return [...without(items, fromIndex), items[fromIndex]];
  }

  return insert(without(items, fromIndex), toIndex, items[fromIndex]);
};

export const separate = <T>(items: T[], predicate: (item: T, index: number) => boolean) =>
  items.reduce<[T[], T[]]>(
    ([passAcc, failAcc], item, index) => {
      if (predicate(item, index)) {
        passAcc.push(item);
      } else {
        failAcc.push(item);
      }

      return [passAcc, failAcc];
    },
    [[], []]
  );

export const findUnion = <T>(lhs: T[], rhs: T[]) => {
  const unique = new Set([...lhs, ...rhs]);

  return Array.from(unique).reduce<{ lhsOnly: T[]; rhsOnly: T[]; union: T[] }>(
    (acc, item) => {
      if (lhs.includes(item)) {
        if (rhs.includes(item)) {
          acc.union.push(item);
        } else {
          acc.lhsOnly.push(item);
        }
      } else {
        acc.rhsOnly.push(item);
      }

      return acc;
    },
    { rhsOnly: [], lhsOnly: [], union: [] }
  );
};

export const hasIdenticalMembers = <T>(lhs: T[], rhs: T[]) => {
  if (lhs.length !== rhs.length) {
    return false;
  }

  if (!lhs.length && !rhs.length) {
    return true;
  }

  return !lhs.some((value) => !rhs.includes(value));
};

export const asyncForEach = async <T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>) => {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line callback-return,no-await-in-loop
    await callback(array[index], index, array);
  }
};

export const without = (items, index) => (index === -1 ? items : [...items.slice(0, index), ...items.slice(index + 1)]);

export const withoutValue = (items, value) => without(items, items.indexOf(value));

export const remove = (items, item) => without(items, items.indexOf(item));

export const replace = (items, index, item) => [...items.slice(0, index), item, ...items.slice(index + 1)];

export const insert = (items, index, item) => [...items.slice(0, index), item, ...items.slice(index)];

export const append = (items, item) => (items.includes(item) ? items : [...items, item]);

export const toggleMembership = (items, item) => (items.includes(item) ? withoutValue(items, item) : [...items, item]);

export const reorder = (items, fromIndex, toIndex) => {
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

export const separate = (items, predicate) =>
  items.reduce(
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

export const hasIdenticalMembers = (lhs, rhs) => {
  if (lhs.length !== rhs.length) {
    return false;
  }

  if (!lhs.length && !rhs.length) {
    return true;
  }

  return !lhs.some((value) => !rhs.includes(value));
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line callback-return,no-await-in-loop
    await callback(array[index], index, array);
  }
};

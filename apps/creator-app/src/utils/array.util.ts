export const conditionalArrayItems = <T>(condition: boolean, ...items: T[]): T[] => (condition ? items : []);

/*
 * Sorts an array of objects according to another array that holds the 'ids'
 * of the objects to be sorted.
 * If the id does not belong in the given `order` array, then it won't appear
 * in the returned array.
 * Returns a new array, but the objects are same references from the given array.
 */
export const mapSort = <T, TO = string>(arr: T[], order: TO[], orderField: keyof T): T[] => {
  const ordered: T[] = [];
  order.forEach((id) => {
    const obj = arr.find((a) => a[orderField] === id);
    if (obj) ordered.push(obj);
  });
  return ordered;
};

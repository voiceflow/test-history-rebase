export const conditionalArrayItems = <T>(condition: boolean, ...items: T[]): T[] => (condition ? items : []);

export const mapSort = <T, TO = string>(arr: T[], order: TO[], orderField: keyof T): T[] => {
  const ordered: T[] = [];
  order.forEach((id) => {
    const obj = arr.find((a) => a[orderField] === id);
    if (obj) ordered.push(obj);
  });
  return ordered;
};

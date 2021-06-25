export const without = <T>(items: T[], index: number): T[] => (index === -1 ? items : [...items.slice(0, index), ...items.slice(index + 1)]);

export const withoutValue = <T>(items: T[], value: T): T[] => without(items, items.indexOf(value));

import type { StructuredFlow } from '@/ducks/diagram';

const recursiveReduce = <T>(getItems: (value: T) => T[], visited = new Set<T>()) => (obj: T): T[] => {
  const items = getItems(obj);
  if (visited.has(obj)) {
    return items;
  }

  const linkedItems = items.flatMap(recursiveReduce(getItems, visited.add(obj)));

  if (linkedItems.length) {
    return linkedItems.reduce(
      (acc, item) => {
        if (!acc.includes(item)) {
          acc.push(item);
        }

        return acc;
      },
      [...items]
    );
  }

  return items;
};

export const findAncestors = (obj: StructuredFlow) => recursiveReduce<StructuredFlow>(({ parents }) => parents)(obj).reverse();

export const findChildren = recursiveReduce<StructuredFlow>(({ children }) => children);

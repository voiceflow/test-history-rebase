export const findAncestors = (obj) => recursiveReduce(({ parents }) => parents)(obj).reverse();

export const findChildren = recursiveReduce(({ children }) => children);

function recursiveReduce(getItems, visited = new Set()) {
  return (obj) => {
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
}

export const toSorted = <T>(
  arr: Array<T>,
  {
    reverse = false,
    getKey = (elem: T) => elem as number,
  }: {
    reverse?: boolean;
    getKey?: (elem: T) => number;
  }
) =>
  arr
    .map((_, idx) => idx)
    .sort((idA, idB) => {
      const variableA = arr[idA];
      const variableB = arr[idB];
      const keyA = getKey(variableA);
      const keyB = getKey(variableB);
      return reverse ? keyA - keyB : keyB - keyA;
    })
    .map((id) => arr[id]);

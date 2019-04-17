export const sortIdsByPosition = (ids, data) =>
  [...ids].sort((lId, rId) => data[lId].position - data[rId].position);

export const getIdsAndValuesFromArrayOfObjects = array =>
  array.reduce(
    (_obj, value) => ({
      ids: [..._obj.ids, value.id],
      values: { ..._obj.values, [value.id]: value },
    }),
    { values: {}, ids: [] }
  );

export const isEqualArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  let i = arr1.length;

  for (; i--; ) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

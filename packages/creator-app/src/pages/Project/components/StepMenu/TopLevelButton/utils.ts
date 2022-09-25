interface HasName {
  name: string;
}
export const sortByName = (a: HasName, b: HasName) => {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();
  if (aName > bName) return 1;
  if (bName > aName) return -1;
  return 0;
};

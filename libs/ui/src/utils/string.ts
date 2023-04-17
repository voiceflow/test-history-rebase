export const getStringHashNumber = (text: string) => {
  const { length } = text;
  let hash = 0;
  let i = 0;
  let chr = 0;
  if (length === 0) return hash;
  for (i = 0; i < length; i++) {
    chr = text.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + chr;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
export const stripAccents = (str?: string) => (str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '');

const usdNumberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatUSD = (value: number, options?: { noDecimal?: boolean; unit?: 'cent' | 'dollar' }) => {
  const sourceValue = options?.unit === 'cent' ? value / 100 : value;
  const formatted = usdNumberFormat.format(sourceValue);

  if (options?.noDecimal) return formatted.replace(/\.00$/, '');

  return formatted;
};

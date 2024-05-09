const usdNumberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatUSD = (value: number, options?: { noDecimal?: boolean }) => {
  const formatted = usdNumberFormat.format(value);

  if (options?.noDecimal) return formatted.replace(/\.00$/, '');

  return formatted;
};

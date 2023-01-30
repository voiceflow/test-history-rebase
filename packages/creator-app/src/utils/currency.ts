const usdNumberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatUSD = (value: number) => usdNumberFormat.format(value);

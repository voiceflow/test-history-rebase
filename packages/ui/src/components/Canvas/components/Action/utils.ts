export const trimLabel = (label: string, maxLength = 28) =>
  label.length > maxLength ? `${label.substring(0, maxLength / 2)}...${label.substring(label.length - maxLength / 2)}` : label;

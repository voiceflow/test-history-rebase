export type Enum<T extends Record<string, string | number>> = T[keyof T];

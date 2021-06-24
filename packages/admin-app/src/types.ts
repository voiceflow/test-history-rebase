export type Nullable<T> = T | null;

export type NonNullishRecord<T extends object> = Required<{ [K in keyof T]: Exclude<T[K], null> }>;

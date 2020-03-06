type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

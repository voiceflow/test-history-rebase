export type KeyRemap<Model, Key extends keyof Model, Value> = Omit<Model, Key> & {
  [key in Key]: Exclude<Model[key], NonNullable<Model[key]>> | Value;
};

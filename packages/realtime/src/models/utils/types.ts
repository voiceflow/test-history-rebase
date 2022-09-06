export type KeyRemap<Model, Key extends keyof Model, Value> = Omit<Model, Key> & {
  [key in Key]: Exclude<Model[Key], NonNullable<Model[Key]>> | Value;
};

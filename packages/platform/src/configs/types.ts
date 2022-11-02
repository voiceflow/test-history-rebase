import { EmptyObject } from '@voiceflow/common';

type ExtendableValue<Value> = Value extends (...args: infer Args) => infer Return ? (...args: Args) => Return : Value;

export type Extendable<Config extends EmptyObject> = {
  [Key in keyof Config]?: Config[Key] extends EmptyObject ? Extendable<Config[Key]> : ExtendableValue<Config[Key]>;
};

export type Merge<Config extends EmptyObject, ExtendConfig extends EmptyObject> = ExtendConfig &
  Pick<Config, Exclude<keyof Config, keyof ExtendConfig>>;

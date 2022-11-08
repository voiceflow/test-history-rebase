import { BuiltInVariable } from '@platform-config/constants';
import { EmptyObject } from '@voiceflow/common';
import { SvgIconTypes } from '@voiceflow/ui';

export interface Icon {
  name: SvgIconTypes.Icon;
  color: string;
}

type ExtendableNonObject<Value> = Value extends (...args: infer Args) => infer Return ? (...args: Args) => Return : Value;

export type Extendable<Config extends EmptyObject> = {
  [Key in keyof Config]?: Config[Key] extends Icon // if value extends icon but has a strict icon type, override it to more generic icon type
    ? Extendable<Omit<Config[Key], 'name'> & { name: SvgIconTypes.Icon }>
    : Config[Key] extends { globalVariables: BuiltInVariable[] } // if value extends globalVariables but has a strict globalVariables type, override it to more generic globalVariables type
    ? Extendable<Omit<Config[Key], 'globalVariables'> & { globalVariables: BuiltInVariable[] }>
    : Config[Key] extends { default: string } // if value extends default voice but has a strict default type, override it to more generic default type
    ? Extendable<Omit<Config[Key], 'default'> & { default: string }>
    : Config[Key] extends EmptyObject // if value is an object, recursively extend it
    ? Extendable<Config[Key]>
    : ExtendableNonObject<Config[Key]>;
};

export type Merge<Config extends EmptyObject, ExtendConfig extends EmptyObject> = ExtendConfig &
  Pick<Config, Exclude<keyof Config, keyof ExtendConfig>>;

import { AnyRecord } from '@voiceflow/common';
import { SystemVariable } from '@voiceflow/dtos';
import type { SvgIconTypes } from '@voiceflow/ui';

export interface Icon {
  name: SvgIconTypes.Icon;
  color: string;
}

type AnyFunc = (...args: any[]) => any;

export type ExtendableRequired<Config extends AnyRecord> = {
  [Key in keyof Config]: Config[Key] extends Icon // if value extends icon but has a strict icon type, override it to more generic icon type
    ? ExtendableRequired<Omit<Config[Key], 'name'> & { name: SvgIconTypes.Icon }>
    : Config[Key] extends { globalVariables: SystemVariable[] } // if value extends globalVariables but has a strict globalVariables type, override it to more generic globalVariables type
    ? ExtendableRequired<Omit<Config[Key], 'globalVariables'> & { globalVariables: SystemVariable[] }>
    : Config[Key] extends { default: string } // if value extends default voice but has a strict default type, override it to more generic default type
    ? ExtendableRequired<Omit<Config[Key], 'default'> & { default: string }>
    : Config[Key] extends AnyFunc // if value is an function
    ? AnyFunc
    : Config[Key] extends AnyRecord // if value is an object, recursively extend it
    ? ExtendableRequired<Config[Key]>
    : Config[Key];
};

export type Extendable<Config extends AnyRecord> = {
  [Key in keyof Config]?: Config[Key] extends Icon // if value extends icon but has a strict icon type, override it to more generic icon type
    ? ExtendableRequired<Omit<Config[Key], 'name'> & { name: SvgIconTypes.Icon }>
    : Config[Key] extends { globalVariables: SystemVariable[] } // if value extends globalVariables but has a strict globalVariables type, override it to more generic globalVariables type
    ? ExtendableRequired<Omit<Config[Key], 'globalVariables'> & { globalVariables: SystemVariable[] }>
    : Config[Key] extends { default: string } // if value extends default voice but has a strict default type, override it to more generic default type
    ? ExtendableRequired<Omit<Config[Key], 'default'> & { default: string }>
    : Config[Key] extends AnyFunc // if value is an function
    ? AnyFunc
    : Config[Key] extends AnyRecord // if value is an object, recursively extend it
    ? ExtendableRequired<Config[Key]>
    : Config[Key];
};

export type ExpectExtends<Value, Expected> = Expected extends Value ? true : false;
export type ExpectValidArgs<Func1 extends AnyFunc, Func2 extends AnyFunc> = Parameters<Func2> extends Parameters<Func1> ? true : false;
export type ExpectValidReturnType<Func1 extends AnyFunc, Func2 extends AnyFunc> = ReturnType<Func2> extends ReturnType<Func1> ? true : false;

export type ExtendableFunctionsRequired<BaseConfig extends AnyRecord, Config extends AnyRecord> = {
  [Key in keyof BaseConfig]: Key extends keyof Config
    ? BaseConfig[Key] extends AnyFunc
      ? Config[Key] extends AnyFunc
        ? ExpectValidArgs<BaseConfig[Key], Config[Key]> extends true
          ? ExpectValidReturnType<BaseConfig[Key], Config[Key]> extends true
            ? Config[Key]
            : BaseConfig[Key]
          : BaseConfig[Key]
        : BaseConfig[Key]
      : Config[Key] extends AnyRecord
      ? BaseConfig[Key] extends AnyRecord
        ? ExtendableFunctionsRequired<BaseConfig[Key], Config[Key]>
        : BaseConfig[Key]
      : BaseConfig[Key]
    : BaseConfig[Key];
};

export type ExtendableFunctions<BaseConfig extends AnyRecord, Config extends AnyRecord> = {
  [Key in keyof Config]: Key extends keyof BaseConfig
    ? BaseConfig[Key] extends AnyFunc
      ? Config[Key] extends AnyFunc
        ? ExpectValidArgs<BaseConfig[Key], Config[Key]> extends true
          ? ExpectValidReturnType<BaseConfig[Key], Config[Key]> extends true
            ? Config[Key]
            : BaseConfig[Key]
          : BaseConfig[Key]
        : BaseConfig[Key]
      : BaseConfig[Key] extends AnyRecord
      ? Config[Key] extends AnyRecord
        ? ExtendableFunctionsRequired<BaseConfig[Key], Config[Key]>
        : BaseConfig[Key]
      : BaseConfig[Key]
    : Config[Key];
};

export type Merge<Config extends AnyRecord, ExtendConfig extends AnyRecord> = ExtendConfig & Pick<Config, Exclude<keyof Config, keyof ExtendConfig>>;

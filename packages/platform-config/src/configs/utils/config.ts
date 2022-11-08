import { Extendable, Merge } from '@platform-config/configs/types';
import { EmptyObject, Utils } from '@voiceflow/common';
import { Required } from 'utility-types';

export const extendFactory =
  <Config extends EmptyObject>(baseConfig: Config) =>
  <ExtendedConfig extends Extendable<Config>>(extendedConfig: ExtendedConfig): Merge<Config, ExtendedConfig> => ({
    ...baseConfig,
    ...extendedConfig,
  });

export const hasValue = <Model extends EmptyObject, Key extends keyof Model>(model: Model, key: Key): model is Model & Required<Model, Key> =>
  Utils.object.hasProperty(model, key) && model[key] !== undefined;

export const pickNonEmptyFields = <Model extends EmptyObject, Key extends keyof Model>(model: Model, keys: Key[]): Partial<Pick<Model, Key>> => {
  if (!keys.length) return {};
  if (keys.length === 1) return hasValue(model, keys[0]) ? ({ [keys[0]]: model[keys[0]] } as unknown as Partial<Pick<Model, Key>>) : {};

  return Object.fromEntries(keys.flatMap((key) => (hasValue(model, key) ? [[key, model[key]]] : []))) as unknown as Partial<Pick<Model, Key>>;
};

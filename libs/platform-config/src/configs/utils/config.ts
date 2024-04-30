import type { AnyRecord } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { Required } from 'utility-types';

import type { Extendable, ExtendableFunctions, Merge } from '@/configs/types';

export const extendFactory =
  <Config extends AnyRecord>(baseConfig: Config) =>
  <ExtendedConfig extends Extendable<Config>>(extendedConfig: ExtendedConfig) =>
  (_cb: (cfg: Merge<Config, ExtendedConfig>) => never): Merge<Config, ExtendedConfig> => ({
    ...baseConfig,
    ...extendedConfig,
  });

export const validateFactory =
  <Config extends AnyRecord>(_baseConfig: Config) =>
  <ExtendedConfig extends AnyRecord>(_extendedConfig: ExtendableFunctions<Config, ExtendedConfig>): never =>
    null as never;

export const hasValue = <Model extends AnyRecord, Key extends keyof Model>(
  model: Model,
  key: Key
): model is Model & Required<Model, Key> => Utils.object.hasProperty(model, key) && model[key] !== undefined;

export const pickNonEmptyFields = <Model extends AnyRecord, Key extends keyof Model>(
  model: Model,
  keys: Key[]
): Partial<Pick<Model, Key>> => {
  if (!keys.length) return {};
  if (keys.length === 1)
    return hasValue(model, keys[0]) ? ({ [keys[0]]: model[keys[0]] } as unknown as Partial<Pick<Model, Key>>) : {};

  return Object.fromEntries(
    keys.flatMap((key) => (hasValue(model, key) ? [[key, model[key]]] : []))
  ) as unknown as Partial<Pick<Model, Key>>;
};

export const partialSatisfies =
  <Config extends AnyRecord>() =>
  <PartialExtendConfig extends Partial<Extendable<Config>>>(config: PartialExtendConfig): PartialExtendConfig =>
    config;

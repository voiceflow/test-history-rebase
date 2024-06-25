import type { EmptyObject } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { Required } from 'utility-types';

export const hasValue = <Model extends EmptyObject, Key extends keyof Model>(
  model: Model,
  key: Key
): model is Model & Required<Model, Key> => Utils.object.hasProperty(model, key) && model[key] !== undefined;

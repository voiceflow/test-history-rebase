import { EmptyObject, Utils } from '@voiceflow/common';
import { Required } from 'utility-types';

export const hasValue = <Model extends EmptyObject, Key extends keyof Model>(model: Model, key: Key): model is Model & Required<Model, Key> =>
  Utils.object.hasProperty(model, key) && model[key] !== undefined;

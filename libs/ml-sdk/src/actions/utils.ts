import { MLError } from '@ml-sdk/types';
import { Utils } from '@voiceflow/common';
import { AsyncActionCreators, Meta } from 'typescript-fsa';

export const { typeFactory: createType, createAction } = Utils.protocol;

// eslint-disable-next-line prefer-destructuring
export const createAsyncAction: <P, R, E extends MLError = MLError>(type: string, commonMeta?: Meta) => AsyncActionCreators<P, R, E> =
  Utils.protocol.createAsyncAction;

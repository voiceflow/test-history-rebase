import { INTENT_KEY } from '@ml-sdk/constants';

import { Intent } from '../models';
import { createAsyncAction, createType } from './utils';

const intentType = createType(INTENT_KEY);

export interface ClarityModelPayload extends Intent.Clarity.ClarityModelRequest {}
export interface ClarityModelResponse extends Intent.Clarity.ClarityModelResponse {}

export const clarityModel = createAsyncAction<ClarityModelPayload, ClarityModelResponse>(intentType('CLARITY_MODEL'));

import { z } from 'zod';

import { ActionRequestButtonDTO } from './action-request-button.dto';
import { GeneralRequestButtonDTO } from './general-request-button.dto';
import { IntentRequestButtonDTO } from './intent-request-button.dto';
import { TextRequestButtonDTO } from './text-request-button.dto';

export const AnyRequestButtonDTO = z.union([
  ActionRequestButtonDTO,
  GeneralRequestButtonDTO,
  IntentRequestButtonDTO,
  TextRequestButtonDTO,
]);

export type AnyRequestButton = z.infer<typeof AnyRequestButtonDTO>;

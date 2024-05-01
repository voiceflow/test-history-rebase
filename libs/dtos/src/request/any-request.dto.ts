import { z } from 'zod';

import { ActionRequestDTO } from './action-request.dto';
import { GeneralRequestDTO } from './general/general-request.dto';
import { PathRequestDTO } from './general/path-request.dto';
import { AlexaIntentRequestDTO } from './intent/alexa-intent-request.dto';
import { LegacyIntentRequestDTO } from './intent/general-intent-request.dto';
import { IntentRequestDTO } from './intent/intent-request.dto';
import { LaunchRequestDTO } from './launch-request.dto';
import { NoReplyRequestDTO } from './no-reply-request.dto';
import { TextRequestDTO } from './text-request.dto';

export const AnyRequestDTO = z.union([
  ActionRequestDTO,
  AlexaIntentRequestDTO,
  LegacyIntentRequestDTO,
  GeneralRequestDTO,
  IntentRequestDTO,
  LaunchRequestDTO,
  PathRequestDTO,
  NoReplyRequestDTO,
  TextRequestDTO,
]);

export type AnyRequest = z.infer<typeof AnyRequestDTO>;

export const isAnyRequest = (value: unknown): value is AnyRequest => AnyRequestDTO.safeParse(value).success;

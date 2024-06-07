import { z } from 'zod';

import { ActionRequestDTO } from './action-request.dto';
import { GeneralActionAndLabelRequestDTO } from './general/general-action-and-label-request.dto';
import { GeneralUnknownRequestDTO } from './general/general-unknown-request.dto';
import { PathRequestDTO } from './general/path-request.dto';
import { IntentRequestDTO } from './intent/intent-request.dto';
import { LaunchRequestDTO } from './launch-request.dto';
import { NoReplyRequestDTO } from './no-reply-request.dto';
import { TextRequestDTO } from './text-request.dto';

export const AnyRequestDTO = z.union([
  ActionRequestDTO,
  LaunchRequestDTO,
  NoReplyRequestDTO,
  TextRequestDTO,
  IntentRequestDTO,
  GeneralUnknownRequestDTO,
  GeneralActionAndLabelRequestDTO,
  PathRequestDTO,
]);

export type AnyRequest = z.infer<typeof AnyRequestDTO>;

export const isAnyRequest = (value: unknown): value is AnyRequest => AnyRequestDTO.safeParse(value).success;

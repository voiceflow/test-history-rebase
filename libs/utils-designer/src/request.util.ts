import type { ActionRequest, IntentRequest, TextRequest } from '@voiceflow/dtos';
import { ActionRequestDTO, IntentRequestDTO, TextRequestDTO } from '@voiceflow/dtos';

export const isTextRequest = (request: unknown): request is TextRequest => TextRequestDTO.safeParse(request).success;

export const isActionRequest = (request: unknown): request is ActionRequest =>
  ActionRequestDTO.safeParse(request).success;

export const isIntentRequest = (request: unknown): request is IntentRequest =>
  IntentRequestDTO.safeParse(request).success;

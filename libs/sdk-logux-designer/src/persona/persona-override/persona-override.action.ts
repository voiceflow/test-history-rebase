import type { AIModel, PersonaOverride } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddOneRequest,
  CreateResponse,
  DeleteManyRequest,
  DeleteOneRequest,
  PatchManyRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';

const personaOverrideAction = createCRUD('persona_override');

export interface PatchData {
  name?: string | null;
  model?: AIModel | null;
  temperature?: number | null;
  maxLength?: number | null;
  systemPrompt?: string | null;
  personaID?: string;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request {
    name: string | null;
    model: AIModel | null;
    temperature: number | null;
    maxLength: number | null;
    systemPrompt: string | null;
    personaID: string;
    assistantID: string;
  }

  export interface Response extends CreateResponse<PersonaOverride> {}
}

export const Create = personaOverrideAction.crud.createOne<Create.Request, Create.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData> {}

export const PatchOne = personaOverrideAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData> {}

export const PatchMany = personaOverrideAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = personaOverrideAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest {}

export const DeleteMany = personaOverrideAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<PersonaOverride> {}

export const Replace = personaOverrideAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<PersonaOverride> {}

export const Add = personaOverrideAction.crud.addOne<Add>();

import type { AIModel, Persona } from '@voiceflow/dtos';

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

const personaAction = createCRUD('persona');

export interface PatchData {
  name?: string;
  model?: AIModel;
  temperature?: number;
  maxLength?: number;
  systemPrompt?: string;
  folderID?: string | null;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request {
    name: string;
    model: AIModel;
    temperature: number;
    maxLength: number;
    systemPrompt: string;
    assistantID: string;
    folderID: string | null;
  }

  export interface Response extends CreateResponse<Persona> {}
}

export const Create = personaAction.crud.createOne<Create.Request, Create.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData> {}

export const PatchOne = personaAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData> {}

export const PatchMany = personaAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = personaAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest {}

export const DeleteMany = personaAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Persona> {}

export const Replace = personaAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<Persona> {}

export const Add = personaAction.crud.addOne<Add>();

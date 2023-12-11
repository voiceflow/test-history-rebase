import { Utils } from '@voiceflow/common';
import type { Assistant, Project, ProjectUserRole } from '@voiceflow/dtos';

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
import type { WorkspaceAction } from '@/workspace/workspace.action';

export const assistantAction = createCRUD('assistant');

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends WorkspaceAction {
    data: {
      templateTag?: string;
      templateName?: string;
      projectMembers?: Array<{ role: ProjectUserRole; creatorID: number }>;
      templatePlatform: string;
      targetProjectListID?: string;
      targetProjectOverride?: Omit<Partial<Project>, '_id'>;
    };
  }

  export interface Response
    extends WorkspaceAction,
      CreateResponse<{
        project: Project;
        // TODO: make it required after V2_CMS is removed
        assistant: Assistant | null;
      }> {}
}

export const CreateOne = assistantAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* DuplicateOne */

export namespace DuplicateOne {
  export interface Request extends WorkspaceAction {
    data: {
      sourceAssistantID: string;
      targetWorkspaceID: string;
      targetProjectListID?: string;
      targetAssistantOverride?: Partial<Pick<Assistant, 'name'>>;
    };
  }

  export interface Response
    extends WorkspaceAction,
      CreateResponse<{
        project: Project;
        // TODO: make it required after V2_CMS is removed
        assistant: Assistant | null;
      }> {}
}

export const DuplicateOne = Utils.protocol.createAsyncAction<DuplicateOne.Request, DuplicateOne.Response>(
  assistantAction('DUPLICATE_ONE')
);

/* PatchOne */

interface PatchData {
  name?: string;
  activePersonaID?: string;
}

export interface PatchOne extends PatchOneRequest<PatchData>, WorkspaceAction {}

export const PatchOne = assistantAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, WorkspaceAction {}

export const PatchMany = assistantAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, WorkspaceAction {}

export const DeleteOne = assistantAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, WorkspaceAction {}

export const DeleteMany = assistantAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Assistant>, WorkspaceAction {}

export const Replace = assistantAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface AddOne extends AddOneRequest<Assistant>, WorkspaceAction {}

export const AddOne = assistantAction.crud.addOne<AddOne>();

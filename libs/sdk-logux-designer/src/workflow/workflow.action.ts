import { Utils } from '@voiceflow/common';
import type { Workflow, WorkflowStatus } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddManyRequest,
  AddOneRequest,
  CreateResponse,
  DeleteManyRequest,
  DeleteOneRequest,
  PatchManyRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';
import type { DesignerAction, DiagramCreateData } from '@/types';

const workflowAction = createCRUD('workflow');

export interface CreateData {
  name: string;
  status: WorkflowStatus | null;
  diagram?: DiagramCreateData;
  folderID: string | null;
  assigneeID: number | null;
  description: string | null;
}

export interface PatchData {
  name?: string;
  status?: WorkflowStatus | null;
  folderID?: string | null;
  assigneeID?: number | null;
  description?: string | null;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Workflow & { triggerNodeID: string | null }>, DesignerAction {}
}

export const CreateOne = workflowAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
  }

  export interface Response
    extends CreateResponse<Array<Workflow & { triggerNodeID: string | null }>>,
      DesignerAction {}
}

export const CreateMany = workflowAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = workflowAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = workflowAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = workflowAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = workflowAction.crud.deleteMany<DeleteMany>();

/* Duplicate */

export namespace DuplicateOne {
  export interface Request extends DesignerAction {
    data: { workflowID: string };
  }

  export interface Response extends DesignerAction, CreateResponse<Workflow> {}
}

export const DuplicateOne = Utils.protocol.createAsyncAction<DuplicateOne.Request, DuplicateOne.Response>(
  workflowAction('DUPLICATE_ONE')
);

/* Copy Past */

export namespace CopyPasteMany {
  export interface Request extends DesignerAction {
    data: {
      sourceDiagramIDs: Array<string>;
      sourceEnvironmentID: string;
    };
  }

  export interface Response extends DesignerAction, CreateResponse<Workflow[]> {}
}

export const CopyPasteMany = Utils.protocol.createAsyncAction<CopyPasteMany.Request, CopyPasteMany.Response>(
  workflowAction('COPY_PASTE_MANY')
);

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Workflow>, DesignerAction {}

export const Replace = workflowAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Workflow>, DesignerAction {}

export const AddOne = workflowAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<Workflow>, DesignerAction {}

export const AddMany = workflowAction.crud.addMany<AddMany>();

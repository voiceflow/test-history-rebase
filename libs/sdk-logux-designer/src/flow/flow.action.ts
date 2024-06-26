import { Utils } from '@voiceflow/common';
import type { Flow } from '@voiceflow/dtos';

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

export const flowAction = createCRUD('flow');

export interface PatchData {
  name?: string;
  folderID?: string | null;
  description?: string | null;
}

export interface CreateData {
  name: string;
  diagram?: DiagramCreateData;
  folderID: string | null;
  description: string | null;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Flow>, DesignerAction {}
}

export const CreateOne = flowAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<Flow[]>, DesignerAction {}
}

export const CreateMany = flowAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = flowAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = flowAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = flowAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = flowAction.crud.deleteMany<DeleteMany>();

/* Duplicate */

export namespace DuplicateOne {
  export interface Request extends DesignerAction {
    data: { flowID: string };
  }

  export interface Response extends DesignerAction {
    data: CreateOne.Response['data'];
  }
}

export const DuplicateOne = Utils.protocol.createAsyncAction<DuplicateOne.Request, DuplicateOne.Response>(
  flowAction('DUPLICATE_ONE')
);

/* Copy Past */

export namespace CopyPasteMany {
  export interface Request extends DesignerAction {
    data: {
      sourceDiagramIDs: Array<string>;
      sourceEnvironmentID: string;
    };
  }

  export interface Response extends DesignerAction {
    data: CreateOne.Response['data'][];
  }
}

export const CopyPasteMany = Utils.protocol.createAsyncAction<CopyPasteMany.Request, CopyPasteMany.Response>(
  flowAction('COPY_PASTE_MANY')
);

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Flow>, DesignerAction {}

export const Replace = flowAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Flow>, DesignerAction {}

export const AddOne = flowAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<Flow>, DesignerAction {}

export const AddMany = flowAction.crud.addMany<AddMany>();

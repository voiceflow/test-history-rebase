import { Utils } from '@voiceflow/common';
import { CRUD } from '@voiceflow/sdk-logux-designer';

import { KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';

import { type as kbType } from '../knowledge-base.action';
import { STATE_KEY } from './document.state';

const documentAction = CRUD.createCRUD(kbType(STATE_KEY));

/* Patch */

export type PatchData = Partial<Pick<KnowledgeBaseDocument, 'tags' | 'status' | 'updatedAt' | 'data'>>;

/* PatchOne */

export interface PatchOne extends CRUD.PatchOneRequest<PatchData> {}

export const PatchOne = documentAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends CRUD.PatchManyRequest<PatchData> {}

export const PatchMany = documentAction.crud.patchMany<PatchMany>();

/* UpdateMany */

export type UpdateData = Partial<Pick<KnowledgeBaseDocument, 'tags' | 'status' | 'updatedAt' | 'data'>> & Pick<KnowledgeBaseDocument, 'id'>;

export interface UpdateMany extends CRUD.UpdateManyRequest<UpdateData> {}

export const UpdateMany = documentAction.crud.updateMany<UpdateMany>();

/* DeleteOne */

export interface DeleteOne extends CRUD.DeleteOneRequest {}

export const DeleteOne = documentAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends CRUD.DeleteManyRequest {}

export const DeleteMany = documentAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends CRUD.ReplaceRequest<KnowledgeBaseDocument> {}

export const Replace = documentAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends CRUD.AddOneRequest<KnowledgeBaseDocument> {}

export const AddOne = documentAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends CRUD.AddManyRequest<KnowledgeBaseDocument> {}

export const AddMany = documentAction.crud.addMany<AddMany>();

/* Internal */

export interface SetFetchStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
}

export const SetFetchStatus = Utils.protocol.createAction<SetFetchStatus>(documentAction('SET_FETCH_STATUS'));

export interface SetProcessingDocumentIDs {
  processingDocumentIDs: string[];
}

export const SetProcessingDocumentIDs = Utils.protocol.createAction<SetProcessingDocumentIDs>(documentAction('SET_PROCESSING_DOCUMENT_IDS'));

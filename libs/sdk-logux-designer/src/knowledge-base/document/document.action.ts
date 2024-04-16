import type { KnowledgeBaseDocument } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type { AddManyRequest, AddOneRequest } from '@/crud/crud.interface';
import type { DesignerAction } from '@/types';

const documentAction = createCRUD('knowledge-base-document');

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<KnowledgeBaseDocument>, DesignerAction {}

export const AddOne = documentAction.crud.addOne<AddOne>();

export interface AddMany extends AddManyRequest<KnowledgeBaseDocument>, DesignerAction {}

export const AddMany = documentAction.crud.addMany<AddMany>();

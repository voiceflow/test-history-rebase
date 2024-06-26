import { CRUD } from '@voiceflow/sdk-logux-designer';

import type { KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';

import { type as kbType } from '../knowledge-base.action';
import { STATE_KEY } from './integration.state';

const integrationAction = CRUD.createCRUD(kbType(STATE_KEY));

/* DeleteOne */

export interface DeleteOne extends CRUD.DeleteOneRequest {}

export const DeleteOne = integrationAction.crud.deleteOne<DeleteOne>();

/* AddMany */

export interface AddMany extends CRUD.AddManyRequest<KnowledgeBaseIntegration> {}

export const AddMany = integrationAction.crud.addMany<AddMany>();

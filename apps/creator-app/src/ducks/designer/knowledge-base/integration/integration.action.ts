import { Utils } from '@voiceflow/common';
import { CRUD } from '@voiceflow/sdk-logux-designer';

import { KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';

import { STATE_KEY } from './integration.state';

export const type = Utils.protocol.typeFactory(STATE_KEY);

const integrationAction = CRUD.createCRUD(type(STATE_KEY));

export interface SetIntegrations {
  integrations: KnowledgeBaseIntegration[];
}

export const SetIntegrations = Utils.protocol.createAction<SetIntegrations>(type('SET_INTEGRATIONS'));

/* DeleteOne */

export interface DeleteOne extends CRUD.DeleteOneRequest {}

export const DeleteOne = integrationAction.crud.deleteOne<DeleteOne>();

/* AddOne */

export interface AddOne extends CRUD.AddOneRequest<KnowledgeBaseIntegration> {}

export const AddOne = integrationAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends CRUD.AddManyRequest<KnowledgeBaseIntegration> {}

export const AddMany = integrationAction.crud.addMany<AddMany>();

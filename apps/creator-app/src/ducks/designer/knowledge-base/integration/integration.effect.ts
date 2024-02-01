import { knowledgeBaseClient } from '@/client/knowledge-base';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import type { KnowledgeBaseIntegration, ZendeskCountFilters, ZendeskFilters } from '@/models/KnowledgeBase.model';
import type { Thunk } from '@/store/types';

import * as Actions from './integration.action';

export const getAll = (): Thunk<KnowledgeBaseIntegration[]> => async (dispatch, getState) => {
  const state = getState();

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  const integrations = await knowledgeBaseClient.getAllIntegrations(projectID);

  dispatch(Actions.AddMany({ data: integrations }));

  return integrations;
};

export const createOne =
  (integrationType: string): Thunk<KnowledgeBaseIntegration> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const integration = await knowledgeBaseClient.createOneIntegration(projectID, integrationType);

    dispatch(Actions.AddOne({ data: integration }));

    return integration;
  };

export const deleteOne =
  (integrationType: string): Thunk<void> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    await knowledgeBaseClient.deleteOneIntegration(projectID, integrationType);

    dispatch(Actions.DeleteOne({ id: integrationType }));
  };

export const getIntegrationAuthUrl =
  (integrationType: string): Thunk<string> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    return knowledgeBaseClient.getIntegrationAuthUrl(projectID, integrationType);
  };

export const getIntegrationFilters =
  (integrationType: string): Thunk<ZendeskFilters> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    return knowledgeBaseClient.getIntegrationFilters(projectID, integrationType);
  };

export const getIntegrationDocumentCount =
  (integrationType: string, filters: ZendeskCountFilters): Thunk<number> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    return knowledgeBaseClient.getIntegrationDocumentCount(projectID, integrationType, filters);
  };

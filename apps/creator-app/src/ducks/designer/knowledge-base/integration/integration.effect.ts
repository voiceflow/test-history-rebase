import { knowledgeBaseClient } from '@/client/knowledge-base';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import type { KnowledgeBaseIntegration, ZendeskCountFilters, ZendeskFilters, ZendeskFilterUserSegment } from '@/models/KnowledgeBase.model';
import type { Thunk } from '@/store/types';

import * as Actions from './integration.action';
import { integrationAdapter } from './integration.adapter';

export const getAll = (): Thunk<KnowledgeBaseIntegration[]> => async (dispatch, getState) => {
  const state = getState();

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  const dbIntegrations = await knowledgeBaseClient.getAllIntegrations(projectID);
  const integrations = integrationAdapter.mapFromDB(dbIntegrations);

  dispatch(Actions.AddMany({ data: integrations }));

  return integrations;
};

export const importIntegration =
  (integrationType: string, refreshRate: string, filters: ZendeskCountFilters = {}): Thunk =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    await knowledgeBaseClient.importIntegration(projectID, integrationType, { filters, refreshRate });
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

export const getIntegrationUserSegments = (): Thunk<ZendeskFilterUserSegment[]> => async (_, getState) => {
  const state = getState();

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  return knowledgeBaseClient.getUserSegmentFilters(projectID);
};

export const getIntegrationDocumentCount =
  (integrationType: string, filters: ZendeskCountFilters): Thunk<number> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    return knowledgeBaseClient.getIntegrationDocumentCount(projectID, integrationType, filters);
  };

import { BaseModels } from '@voiceflow/base-types';

import { knowledgeBaseClient } from '@/client/knowledge-base';
import { CREATOR_APP_ENDPOINT } from '@/config';
import * as Errors from '@/config/errors';
import { Path } from '@/config/routes';
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

  const integrations = integrationAdapter.mapFromDB(dbIntegrations.data);

  dispatch(Actions.AddMany({ data: integrations }));

  return integrations;
};

export const importIntegration =
  (integrationType: BaseModels.Project.IntegrationTypes, refreshRate: string, filters: ZendeskCountFilters = {}): Thunk<number> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const data = await knowledgeBaseClient.importIntegration(projectID, integrationType, { filters, refreshRate });

    return data.status;
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
  (integrationType: string, payload?: { subdomain?: string }): Thunk<string> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const { data } = await knowledgeBaseClient.getIntegrationAuthUrl({
      ...payload,
      projectID,
      redirectUrl: `${CREATOR_APP_ENDPOINT}${Path.ZENDESK_CALLBACK}`,
      integrationType,
    });

    return data.url;
  };

export const getIntegrationAuthReconnectUrl =
  (integrationType: string): Thunk<string> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const { data } = await knowledgeBaseClient.getIntegrationAuthReconnectUrl({
      projectID,
      integrationType,
      redirectUrl: `${CREATOR_APP_ENDPOINT}${Path.ZENDESK_CALLBACK}`,
    });

    return data.url;
  };

export const getIntegrationFilters =
  (integrationType: string): Thunk<ZendeskFilters> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const { data } = await knowledgeBaseClient.getIntegrationFilters(projectID, integrationType);

    return data;
  };

export const getIntegrationUserSegments =
  (filters: ZendeskCountFilters): Thunk<ZendeskFilterUserSegment[]> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const { data } = await knowledgeBaseClient.getUserSegmentFilters(projectID, filters);

    return data;
  };

export const getIntegrationDocumentCount =
  (integrationType: string, filters: ZendeskCountFilters): Thunk<number> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const { data } = await knowledgeBaseClient.getIntegrationDocumentCount(projectID, integrationType, filters);

    return data.count;
  };

export const createOne =
  (integrationType: string, code: string, authState: string): Thunk<void> =>
  async (dispatch, _) => {
    const redirectUrl = `${CREATOR_APP_ENDPOINT}${Path.ZENDESK_CALLBACK}`;

    await knowledgeBaseClient.createOneIntegration(integrationType, { code, state: authState, redirectUrl });

    dispatch(getAll());
  };

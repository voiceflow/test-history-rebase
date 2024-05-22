import { BaseModels } from '@voiceflow/base-types';

import { designerClient } from '@/client/designer';
import { CREATOR_APP_ENDPOINT } from '@/config';
import * as Errors from '@/config/errors';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import type { KnowledgeBaseIntegration, ZendeskCountFilters, ZendeskFilters, ZendeskFilterUserSegment } from '@/models/KnowledgeBase.model';
import type { Thunk } from '@/store/types';

import * as Actions from './integration.action';
import { realtimeIntegrationAdapter } from './integration.adapter';

export const getAll = (): Thunk<KnowledgeBaseIntegration[]> => async (dispatch, getState) => {
  const state = getState();

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  const response = await designerClient.knowledgeBase.integration.getIntegrations(projectID);
  const integrations = realtimeIntegrationAdapter.mapFromDB(response.data ?? []);


  dispatch.local(Actions.AddMany({ data: integrations }));

  return integrations;
};

export const importIntegration =
  (
    integrationType: BaseModels.Project.IntegrationTypes,
    refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate,
    filters: ZendeskCountFilters = {}
  ): Thunk<void> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    await designerClient.knowledgeBase.integration.uploadDocsByFiltersIntegration(projectID, integrationType, { data: { filters, refreshRate } });

  };

export const deleteOne =
  (integrationType: string): Thunk<void> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    await designerClient.knowledgeBase.integration.deleteIntegration(projectID, integrationType);


    dispatch.local(Actions.DeleteOne({ id: integrationType }));
  };

export const getIntegrationAuthUrl =
  (integrationType: string, payload?: { subdomain?: string }): Thunk<string> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const response = await designerClient.knowledgeBase.integration.authUrlIntegration(projectID, integrationType, {
      query: {
        ...payload,
        redirectUrl: `${CREATOR_APP_ENDPOINT}${Path.INTEGRATION_ZENDESK_CALLBACK}`,
      },
    });
    const data = response.data;


    return data.url;
  };

export const getIntegrationAuthReconnectUrl =
  (integrationType: string): Thunk<string> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const response = await designerClient.knowledgeBase.integration.authUrlReconnectIntegration(projectID, integrationType, {
      query: {
        redirectUrl: `${CREATOR_APP_ENDPOINT}${Path.INTEGRATION_ZENDESK_CALLBACK}`,
      },
    });
    const data = response.data;

    return data.url;
  };

export const getIntegrationFilters =
  (integrationType: string, subdomain?: string): Thunk<ZendeskFilters> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const response = await designerClient.knowledgeBase.integration.fetchFiltersIntegration(projectID, integrationType, {
      query: {
        subdomain,
      },
    });
    return response.data;

  };

export const getIntegrationDocumentCount =
  (integrationType: string, filters: ZendeskCountFilters): Thunk<{ count: number; userSegments: ZendeskFilterUserSegment[] }> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);


    const response = await designerClient.knowledgeBase.integration.fetchCountByFiltersIntegration(projectID, integrationType, {
      data: { filters },
    });
    return response.data;

  };

export const createOne =
  (integrationType: string, code: string, authState: string): Thunk<void> =>
  async (dispatch, _) => {

    const redirectUrl = `${CREATOR_APP_ENDPOINT}${Path.INTEGRATION_ZENDESK_CALLBACK}`;

    await designerClient.knowledgeBase.integration.callbackIntegration(integrationType, { query: { code, state: authState, redirectUrl } });

    dispatch(getAll());
  };

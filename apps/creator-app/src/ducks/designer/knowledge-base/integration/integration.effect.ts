import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { designerClient } from '@/client/designer';
import { knowledgeBaseClient } from '@/client/knowledge-base';
import { CREATOR_APP_ENDPOINT } from '@/config';
import * as Errors from '@/config/errors';
import { Path } from '@/config/routes';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import type { KnowledgeBaseIntegration, ZendeskCountFilters, ZendeskFilters, ZendeskFilterUserSegment } from '@/models/KnowledgeBase.model';
import type { Thunk } from '@/store/types';

import * as Actions from './integration.action';
import { integrationAdapter, realtimeIntegrationAdapter } from './integration.adapter';

export const getAll = (): Thunk<KnowledgeBaseIntegration[]> => async (dispatch, getState) => {
  const state = getState();
  const realtimeKBEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_INTEGRATIONS);

  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  let integrations: KnowledgeBaseIntegration[] = [];
  if (realtimeKBEnabled) {
    const response = await designerClient.knowledgeBase.integration.getIntegrations(projectID);
    integrations = realtimeIntegrationAdapter.mapFromDB(response.data ?? []);
  } else {
    const dbIntegrations = await knowledgeBaseClient.getAllIntegrations(projectID);

    integrations = integrationAdapter.mapFromDB(dbIntegrations.data);
  }

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
    const kbIntegrationsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_INTEGRATIONS);

    Errors.assertProjectID(projectID);

    if (kbIntegrationsEnabled) {
      await designerClient.knowledgeBase.integration.uploadDocsByFiltersIntegration(projectID, integrationType, { data: { filters, refreshRate } });
      return;
    }

    await knowledgeBaseClient.importIntegration(projectID, integrationType, { filters, refreshRate });
  };

export const deleteOne =
  (integrationType: string): Thunk<void> =>
  async (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);
    const kbIntegrationsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_INTEGRATIONS);

    Errors.assertProjectID(projectID);

    if (kbIntegrationsEnabled) {
      await designerClient.knowledgeBase.integration.deleteIntegration(projectID, integrationType);
    } else {
      await knowledgeBaseClient.deleteOneIntegration(projectID, integrationType);
    }

    dispatch.local(Actions.DeleteOne({ id: integrationType }));
  };

export const getIntegrationAuthUrl =
  (integrationType: string, payload?: { subdomain?: string }): Thunk<string> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);
    const kbIntegrationsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_INTEGRATIONS);

    Errors.assertProjectID(projectID);

    let data: { url: string };
    if (kbIntegrationsEnabled) {
      const response = await designerClient.knowledgeBase.integration.authUrlIntegration(projectID, integrationType, {
        query: {
          ...payload,
          redirectUrl: `${CREATOR_APP_ENDPOINT}${Path.INTEGRATION_ZENDESK_CALLBACK}`,
        },
      });
      data = response.data;
    } else {
      const urlResponse = await knowledgeBaseClient.getIntegrationAuthUrl({
        ...payload,
        projectID,
        redirectUrl: `${CREATOR_APP_ENDPOINT}${Path.INTEGRATION_ZENDESK_CALLBACK}`,
        integrationType,
      });
      data = urlResponse.data;
    }

    return data.url;
  };

export const getIntegrationAuthReconnectUrl =
  (integrationType: string): Thunk<string> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);
    const kbIntegrationsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_INTEGRATIONS);

    Errors.assertProjectID(projectID);

    let data: { url: string };
    if (kbIntegrationsEnabled) {
      const response = await designerClient.knowledgeBase.integration.authUrlReconnectIntegration(projectID, integrationType, {
        query: {
          redirectUrl: `${CREATOR_APP_ENDPOINT}${Path.INTEGRATION_ZENDESK_CALLBACK}`,
        },
      });
      data = response.data;
    } else {
      const urlResponse = await knowledgeBaseClient.getIntegrationAuthReconnectUrl({
        projectID,
        integrationType,
        redirectUrl: `${CREATOR_APP_ENDPOINT}${Path.INTEGRATION_ZENDESK_CALLBACK}`,
      });
      data = urlResponse.data;
    }

    return data.url;
  };

export const getIntegrationFilters =
  (integrationType: string, subdomain?: string): Thunk<ZendeskFilters> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);
    const kbIntegrationsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_INTEGRATIONS);

    Errors.assertProjectID(projectID);

    if (kbIntegrationsEnabled) {
      const response = await designerClient.knowledgeBase.integration.fetchFiltersIntegration(projectID, integrationType, {
        query: {
          subdomain,
        },
      });
      return response.data;
    }

    const { data } = await knowledgeBaseClient.getIntegrationFilters({ projectID, integrationType, subdomain });
    return data;
  };

export const getIntegrationDocumentCount =
  (integrationType: string, filters: ZendeskCountFilters): Thunk<{ count: number; userSegments: ZendeskFilterUserSegment[] }> =>
  async (_, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);
    const kbIntegrationsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_INTEGRATIONS);

    Errors.assertProjectID(projectID);

    if (kbIntegrationsEnabled) {
      const response = await designerClient.knowledgeBase.integration.fetchCountByFiltersIntegration(projectID, integrationType, {
        data: { filters },
      });
      return response.data;
    }

    const { data } = await knowledgeBaseClient.getIntegrationDocumentCount(projectID, integrationType, filters);

    return data;
  };

export const createOne =
  (integrationType: string, code: string, authState: string): Thunk<void> =>
  async (dispatch, getState) => {
    const state = getState();
    const kbIntegrationsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.KB_BE_INTEGRATIONS);

    const redirectUrl = `${CREATOR_APP_ENDPOINT}${Path.INTEGRATION_ZENDESK_CALLBACK}`;

    if (kbIntegrationsEnabled) {
      await designerClient.knowledgeBase.integration.callbackIntegration(integrationType, { query: { code, state: authState, redirectUrl } });
    } else {
      await knowledgeBaseClient.createOneIntegration(integrationType, { code, state: authState, redirectUrl });
    }

    dispatch(getAll());
  };

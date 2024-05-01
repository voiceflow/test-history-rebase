import { Utils } from '@voiceflow/common';
import { describe, expect, it } from 'vitest';

import * as Fetch from './fetch';
import client, { WORKSPACES_PATH } from './workspace';

const WORKSPACE_ID = Utils.generate.id();

describe('Client - Workspace', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(
      expect.arrayContaining([
        'getPlan',
        'getPlans',
        'updateSource',
        'calculatePrice',
        'getInvoices',
        'getPlanSubscription',
        'getUsageSubscription',
        'cancelSubscription',
        'listAPIKeys',
      ])
    );
  });

  describe('getPlans()', () => {
    it('should get all plans', async () => {
      const plans = Utils.generate.array(3, Utils.generate.object);
      const fetch = vi.spyOn(Fetch.api, 'get').mockResolvedValue(plans);

      expect(await client.getPlans()).toEqual(plans);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/plans`);
    });
  });

  describe('getPlan()', () => {
    it('should get plan for a specific workspace', async () => {
      const plan: any = Utils.generate.object();
      const fetch = vi.spyOn(Fetch.api, 'get').mockResolvedValue(plan);

      expect(await client.getPlan(WORKSPACE_ID)).toEqual(plan);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/plan`);
    });
  });

  describe('updateSource()', () => {
    it('should update the source of a workspace', async () => {
      const sourceID = Utils.generate.id();
      const fetch = vi.spyOn(Fetch.api, 'patch');

      await client.updateSource(WORKSPACE_ID, sourceID);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/source`, { source_id: sourceID });
    });
  });

  describe('listAPIKeys()', () => {
    it('should get a link for a workspace invitation', async () => {
      const apiKeys = Utils.generate.array(3, Utils.generate.string);
      const fetch = vi.spyOn(Fetch.apiV2, 'get').mockResolvedValue(apiKeys);

      expect(await client.listAPIKeys(WORKSPACE_ID)).toEqual(apiKeys);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/api-keys`);
    });
  });
});

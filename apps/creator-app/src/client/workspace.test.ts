import { Utils } from '@voiceflow/common';

import client, { WORKSPACES_PATH } from '@/client/workspace';

import suite from './_suite';

const WORKSPACE_ID = Utils.generate.id();

suite('Client - Workspace', ({ expectMembers, stubFetch }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), [
      'getPlan',
      'getPlans',
      'updateSource',
      'calculatePrice',
      'getInvoices',
      'getPlanSubscription',
      'getUsageSubscription',
      'cancelSubscription',
      'listAPIKeys',
    ]);
  });

  describe('getPlans()', () => {
    it('should get all plans', async () => {
      const plans = Utils.generate.array(3, Utils.generate.object);
      const fetch = stubFetch('api', 'get').mockResolvedValue(plans);

      expect(await client.getPlans()).toEqual(plans);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/plans`);
    });
  });

  describe('getPlan()', () => {
    it('should get plan for a specific workspace', async () => {
      const plan: any = Utils.generate.object();
      const fetch = stubFetch('api', 'get').mockResolvedValue(plan);

      expect(await client.getPlan(WORKSPACE_ID)).toEqual(plan);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/plan`);
    });
  });

  describe('updateSource()', () => {
    it('should update the source of a workspace', async () => {
      const sourceID = Utils.generate.id();
      const fetch = stubFetch('api', 'patch');

      await client.updateSource(WORKSPACE_ID, sourceID);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/source`, { source_id: sourceID });
    });
  });

  describe('listAPIKeys()', () => {
    it('should get a link for a workspace invitation', async () => {
      const apiKeys = Utils.generate.array(3, Utils.generate.string);
      const fetch = stubFetch('apiV2', 'get').mockResolvedValue(apiKeys);

      expect(await client.listAPIKeys(WORKSPACE_ID)).toEqual(apiKeys);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/api-keys`);
    });
  });
});

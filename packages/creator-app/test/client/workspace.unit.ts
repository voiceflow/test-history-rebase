import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import invoiceAdapter from '@/client/adapters/invoice';
import client, { LEGACY_WORKSPACE_PATH, WORKSPACES_PATH } from '@/client/workspace';

import suite from './_suite';

const WORKSPACE_ID = Utils.generate.id();

suite('Client - Workspace', ({ expectMembers, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), [
      'find',
      'fetchWorkspace',
      'createWorkspace',
      'findMembers',
      'deleteWorkspace',
      'leaveWorkspace',
      'updateName',
      'updateImage',
      'validateInvite',
      'getInvoice',
      'getPlans',
      'getPlan',
      'updateSource',
      'calculatePrice',
      'checkout',
      'updateMember',
      'deleteMember',
      'cancelInvite',
      'updateInvite',
      'sendInvite',
      'acceptInvite',
      'getInviteLink',
      'listAPIKeys',
      'validateCoupon',
      'getOrganization',
    ]);
  });

  describe('find()', () => {
    it('should find all workspaces', async () => {
      const dbWorkspaces = Utils.generate.array<any>(3, Utils.generate.object);
      const [workspaces, mapWorkspacesFromDB] = stubAdapter(Realtime.Adapters.workspaceAdapter, 'mapFromDB', Utils.generate.array);
      const fetch = stubFetch('api').mockResolvedValue(dbWorkspaces);

      const result = await client.find();

      expect(result).toEqual(workspaces);
      expect(fetch.mock.calls[0]).toEqual([WORKSPACES_PATH, undefined]);
      expect(mapWorkspacesFromDB).toBeCalledWith(dbWorkspaces);
    });
  });

  describe('fetchWorkspace()', () => {
    it('should get a workspace by its ID', async () => {
      const dbWorkspace = Utils.generate.object();
      const [workspace, workspaceFromDB] = stubAdapter(Realtime.Adapters.workspaceAdapter, 'fromDB', Utils.generate.object);
      const fetch = stubFetch('api').mockResolvedValue(dbWorkspace);

      const result = await client.fetchWorkspace(WORKSPACE_ID);

      expect(result).toEqual(workspace);
      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}`);
      expect(workspaceFromDB).toBeCalledWith(dbWorkspace);
    });
  });

  describe('createWorkspace()', () => {
    it('should create a new workspace', async () => {
      const payload: any = Utils.generate.object();
      const dbWorkspace: any = Utils.generate.object();
      const [workspace, workspaceFromDB] = stubAdapter(Realtime.Adapters.workspaceAdapter, 'fromDB', Utils.generate.object);
      const fetch = stubFetch('api', 'post').mockResolvedValue(dbWorkspace);

      const result = await client.createWorkspace(payload);

      expect(result).toEqual(workspace);
      expect(fetch).toBeCalledWith(WORKSPACES_PATH, payload);
      expect(workspaceFromDB).toBeCalledWith(dbWorkspace);
    });
  });

  describe('findMembers()', () => {
    it('should create a new workspace', async () => {
      const dbMembers = Utils.generate.array<any>(3, Utils.generate.object);
      const [members, mapMembersFromDB] = stubAdapter(Realtime.Adapters.memberAdapter, 'mapFromDB', Utils.generate.array);
      const fetch = stubFetch('api').mockResolvedValue(dbMembers);

      const result = await client.findMembers(WORKSPACE_ID);

      expect(result).toEqual(members);
      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members`);
      expect(mapMembersFromDB).toBeCalledWith(dbMembers);
    });
  });

  describe('deleteWorkspace()', () => {
    it('should delete workspace', async () => {
      const fetch = stubFetch('api', 'delete');

      await client.deleteWorkspace(WORKSPACE_ID);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}`);
    });
  });

  describe('leaveWorkspace()', () => {
    it('should delete workspace membership', async () => {
      const fetch = stubFetch('api', 'delete');

      await client.leaveWorkspace(WORKSPACE_ID);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members/self`);
    });
  });

  describe('updateName()', () => {
    it('should update name', async () => {
      const name = Utils.generate.string();
      const fetch = stubFetch('api', 'patch');

      await client.updateName(WORKSPACE_ID, name);

      expect(fetch).toBeCalledWith(`${LEGACY_WORKSPACE_PATH}/${WORKSPACE_ID}/update_name`, { name });
    });
  });

  describe('updateImage()', () => {
    it('should update image', async () => {
      const url = Utils.generate.string();
      const fetch = stubFetch('api', 'post');

      await client.updateImage(WORKSPACE_ID, url);

      expect(fetch).toBeCalledWith(`${LEGACY_WORKSPACE_PATH}/${WORKSPACE_ID}/picture`, { url });
    });
  });

  describe('acceptInvite()', () => {
    it('should accept invite', async () => {
      const invite = Utils.generate.id();
      const token = Utils.generate.string();
      const fetch = stubFetch('api', 'post').mockResolvedValue(token);

      expect(await client.acceptInvite(invite)).toEqual(token);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/invite/${invite}`);
    });
  });

  describe('validateInvite()', () => {
    it('should validate invite', async () => {
      const invite = Utils.generate.id();
      const fetch = stubFetch('api', 'get').mockResolvedValue(true);

      expect(await client.validateInvite(invite)).toBeTruthy();

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/invite/${invite}`);
    });
  });

  describe('getInvoice()', () => {
    it('should get invoice', async () => {
      const dbInvoice: any = Utils.generate.object();
      const [invoice, invoiceFromDB] = stubAdapter(invoiceAdapter, 'fromDB', Utils.generate.object);
      const fetch = stubFetch('api', 'get').mockResolvedValue(dbInvoice);

      expect(await client.getInvoice(WORKSPACE_ID)).toEqual(invoice);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invoice`);
      expect(invoiceFromDB).toBeCalledWith(dbInvoice);
    });
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

  describe('calculatePrice()', () => {
    it('should calculate the price of an upgrade', async () => {
      const data: any = Utils.generate.object();
      const price: any = Utils.generate.object();
      const fetch = stubFetch('api', 'post').mockResolvedValue(price);

      expect(await client.calculatePrice(WORKSPACE_ID, data)).toEqual(price);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/price`, data);
    });
  });

  describe('checkout()', () => {
    it('should checkout in a workspace upgrade', async () => {
      const data: any = Utils.generate.object();
      const fetch = stubFetch('api', 'post');

      await client.checkout(WORKSPACE_ID, data);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/checkout`, data);
    });
  });

  describe('updateMember()', () => {
    it('should update a workspace member', async () => {
      const creatorID = Utils.generate.number();
      const fetch = stubFetch('api', 'patch');

      await client.updateMember(WORKSPACE_ID, creatorID, UserRole.GUEST);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members/${creatorID}`, { role: UserRole.GUEST });
    });
  });

  describe('deleteMember()', () => {
    it('should delete a workspace member', async () => {
      const creatorID = Utils.generate.number();
      const fetch = stubFetch('api', 'delete');

      await client.deleteMember(WORKSPACE_ID, creatorID);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members/${creatorID}`);
    });
  });

  describe('cancelInvite()', () => {
    it('should cancel a workspace invite', async () => {
      const email = Utils.generate.string();
      const fetch = stubFetch('api', 'delete');

      await client.cancelInvite(WORKSPACE_ID, email);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invite`, { email });
    });
  });

  describe('updateInvite()', () => {
    it('should update a workspace invite', async () => {
      const email = Utils.generate.string();
      const fetch = stubFetch('api', 'patch');

      await client.updateInvite(WORKSPACE_ID, email, UserRole.BILLING);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invite`, { email, role: UserRole.BILLING });
    });
  });

  describe('sendInvite()', () => {
    const email = Utils.generate.string();

    it('should send an invite to a workspace', async () => {
      const member = Utils.generate.object();
      const fetch = stubFetch('api', 'post').mockResolvedValue(member);

      expect(await client.sendInvite(WORKSPACE_ID, email)).toEqual(member);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invite`, { email, role: undefined });
    });

    it('should send an invite with a specific role to a workspace', async () => {
      const fetch = stubFetch('api', 'post');

      await client.sendInvite(WORKSPACE_ID, email, UserRole.ADMIN);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invite`, { email, role: UserRole.ADMIN });
    });
  });

  describe('getInviteLink()', () => {
    it('should get a link for a workspace invitation', async () => {
      const link = Utils.generate.string();
      const fetch = stubFetch('api', 'post').mockResolvedValue(link);

      expect(await client.getInviteLink(WORKSPACE_ID, UserRole.VIEWER)).toEqual(link);

      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/${WORKSPACE_ID}/inviteLink`, { role: UserRole.VIEWER });
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

  describe('validateCoupon()', () => {
    it('check if coupon is valid', async () => {
      const couponCode = Utils.generate.id();
      const fetch = stubFetch('api', 'get').mockResolvedValue('true');

      const result = await client.validateCoupon(couponCode);

      expect(result).toBeTruthy();
      expect(fetch).toBeCalledWith(`${WORKSPACES_PATH}/coupon/${couponCode}`);
    });
  });
});

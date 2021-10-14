import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { generate } from '@voiceflow/ui';

import invoiceAdapter from '@/client/adapters/invoice';
import memberAdapter from '@/client/adapters/member';
import client, { LEGACY_WORKSPACE_PATH, WORKSPACES_PATH } from '@/client/workspace';

import suite from './_suite';

const WORKSPACE_ID = generate.id();

suite('Client - Workspace', ({ expect, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members([
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
    ]);
  });

  describe('find()', () => {
    it('should find all workspaces', async () => {
      const dbWorkspaces = generate.array<any>(3, generate.object);
      const [workspaces, mapWorkspacesFromDB] = stubAdapter(Realtime.Adapters.workspaceAdapter, 'mapFromDB', generate.array);
      const fetch = stubFetch('api').resolves(dbWorkspaces);

      const result = await client.find();

      expect(result).to.eq(workspaces);
      expect(fetch.args[0]).to.eql([WORKSPACES_PATH, undefined]);
      expect(mapWorkspacesFromDB).to.be.calledWithExactly(dbWorkspaces);
    });
  });

  describe('fetchWorkspace()', () => {
    it('should get a workspace by its ID', async () => {
      const dbWorkspace = generate.object();
      const [workspace, workspaceFromDB] = stubAdapter(Realtime.Adapters.workspaceAdapter, 'fromDB', generate.object);
      const fetch = stubFetch('api').resolves(dbWorkspace);

      const result = await client.fetchWorkspace(WORKSPACE_ID);

      expect(result).to.eq(workspace);
      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}`);
      expect(workspaceFromDB).to.be.calledWithExactly(dbWorkspace);
    });
  });

  describe('createWorkspace()', () => {
    it('should create a new workspace', async () => {
      const payload: any = generate.object();
      const dbWorkspace: any = generate.object();
      const [workspace, workspaceFromDB] = stubAdapter(Realtime.Adapters.workspaceAdapter, 'fromDB', generate.object);
      const fetch = stubFetch('api', 'post').resolves(dbWorkspace);

      const result = await client.createWorkspace(payload);

      expect(result).to.eq(workspace);
      expect(fetch).to.be.calledWithExactly(WORKSPACES_PATH, payload);
      expect(workspaceFromDB).to.be.calledWithExactly(dbWorkspace);
    });
  });

  describe('findMembers()', () => {
    it('should create a new workspace', async () => {
      const dbMembers: any[] = generate.array(3, generate.object);
      const [members, mapMembersFromDB] = stubAdapter(memberAdapter, 'mapFromDB', generate.array);
      const fetch = stubFetch('api').resolves(dbMembers);

      const result = await client.findMembers(WORKSPACE_ID);

      expect(result).to.eq(members);
      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members`);
      expect(mapMembersFromDB).to.be.calledWithExactly(dbMembers);
    });
  });

  describe('deleteWorkspace()', () => {
    it('should delete workspace', async () => {
      const fetch = stubFetch('api', 'delete');

      await client.deleteWorkspace(WORKSPACE_ID);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}`);
    });
  });

  describe('leaveWorkspace()', () => {
    it('should delete workspace membership', async () => {
      const fetch = stubFetch('api', 'delete');

      await client.leaveWorkspace(WORKSPACE_ID);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members/self`);
    });
  });

  describe('updateName()', () => {
    it('should update name', async () => {
      const name = generate.string();
      const fetch = stubFetch('api', 'patch');

      await client.updateName(WORKSPACE_ID, name);

      expect(fetch).to.be.calledWithExactly(`${LEGACY_WORKSPACE_PATH}/${WORKSPACE_ID}/update_name`, { name });
    });
  });

  describe('updateImage()', () => {
    it('should update image', async () => {
      const url = generate.string();
      const fetch = stubFetch('api', 'post');

      await client.updateImage(WORKSPACE_ID, url);

      expect(fetch).to.be.calledWithExactly(`${LEGACY_WORKSPACE_PATH}/${WORKSPACE_ID}/picture`, { url });
    });
  });

  describe('acceptInvite()', () => {
    it('should accept invite', async () => {
      const invite = generate.id();
      const token = generate.string();
      const fetch = stubFetch('api', 'post').resolves(token);

      await expect(client.acceptInvite(invite)).to.eventually.eq(token);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/invite/${invite}`);
    });
  });

  describe('validateInvite()', () => {
    it('should validate invite', async () => {
      const invite = generate.id();
      const fetch = stubFetch('api', 'get').resolves(true);

      await expect(client.validateInvite(invite)).to.eventually.be.true;

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/invite/${invite}`);
    });
  });

  describe('getInvoice()', () => {
    it('should get invoice', async () => {
      const dbInvoice: any = generate.object();
      const [invoice, invoiceFromDB] = stubAdapter(invoiceAdapter, 'fromDB', generate.object);
      const fetch = stubFetch('api', 'get').resolves(dbInvoice);

      await expect(client.getInvoice(WORKSPACE_ID)).to.eventually.eq(invoice);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invoice`);
      expect(invoiceFromDB).to.be.calledWithExactly(dbInvoice);
    });
  });

  describe('getPlans()', () => {
    it('should get all plans', async () => {
      const plans = generate.array(3, generate.object);
      const fetch = stubFetch('api', 'get').resolves(plans);

      await expect(client.getPlans()).to.eventually.eq(plans);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/plans`);
    });
  });

  describe('getPlan()', () => {
    it('should get plan for a specific workspace', async () => {
      const plan: any = generate.object();
      const fetch = stubFetch('api', 'get').resolves(plan);

      await expect(client.getPlan(WORKSPACE_ID)).to.eventually.eq(plan);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/plan`);
    });
  });

  describe('updateSource()', () => {
    it('should update the source of a workspace', async () => {
      const sourceID = generate.id();
      const fetch = stubFetch('api', 'patch');

      await client.updateSource(WORKSPACE_ID, sourceID);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/source`, { source_id: sourceID });
    });
  });

  describe('calculatePrice()', () => {
    it('should calculate the price of an upgrade', async () => {
      const data: any = generate.object();
      const price: any = generate.object();
      const fetch = stubFetch('api', 'post').resolves(price);

      await expect(client.calculatePrice(WORKSPACE_ID, data)).to.eventually.eq(price);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/price`, data);
    });
  });

  describe('checkout()', () => {
    it('should checkout in a workspace upgrade', async () => {
      const data: any = generate.object();
      const fetch = stubFetch('api', 'post');

      await client.checkout(WORKSPACE_ID, data);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/checkout`, data);
    });
  });

  describe('updateMember()', () => {
    it('should update a workspace member', async () => {
      const creatorID = generate.number();
      const fetch = stubFetch('api', 'patch');

      await client.updateMember(WORKSPACE_ID, creatorID, UserRole.GUEST);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members/${creatorID}`, { role: UserRole.GUEST });
    });
  });

  describe('deleteMember()', () => {
    it('should delete a workspace member', async () => {
      const creatorID = generate.number();
      const fetch = stubFetch('api', 'delete');

      await client.deleteMember(WORKSPACE_ID, creatorID);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members/${creatorID}`);
    });
  });

  describe('cancelInvite()', () => {
    it('should cancel a workspace invite', async () => {
      const email = generate.string();
      const fetch = stubFetch('api', 'delete');

      await client.cancelInvite(WORKSPACE_ID, email);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invite`, { email });
    });
  });

  describe('updateInvite()', () => {
    it('should update a workspace invite', async () => {
      const email = generate.string();
      const fetch = stubFetch('api', 'patch');

      await client.updateInvite(WORKSPACE_ID, email, UserRole.LIBRARY);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invite`, { email, role: UserRole.LIBRARY });
    });
  });

  describe('sendInvite()', () => {
    const email = generate.string();

    it('should send an invite to a workspace', async () => {
      const member = generate.object();
      const fetch = stubFetch('api', 'post').resolves(member);

      await expect(client.sendInvite(WORKSPACE_ID, email)).to.eventually.eq(member);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invite`, { email, role: undefined });
    });

    it('should send an invite with a specific role to a workspace', async () => {
      const fetch = stubFetch('api', 'post');

      await client.sendInvite(WORKSPACE_ID, email, UserRole.ADMIN);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/invite`, { email, role: UserRole.ADMIN });
    });
  });

  describe('getInviteLink()', () => {
    it('should get a link for a workspace invitation', async () => {
      const link = generate.string();
      const fetch = stubFetch('api', 'post').resolves(link);

      await expect(client.getInviteLink(WORKSPACE_ID, UserRole.VIEWER)).to.eventually.eq(link);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/inviteLink`, { role: UserRole.VIEWER });
    });
  });

  describe('listAPIKeys()', () => {
    it('should get a link for a workspace invitation', async () => {
      const apiKeys = generate.array(3, generate.string);
      const fetch = stubFetch('apiV2', 'get').resolves(apiKeys);

      await expect(client.listAPIKeys(WORKSPACE_ID)).to.eventually.eq(apiKeys);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/api-keys`);
    });
  });

  describe('validateCoupon()', () => {
    it('check if coupon is valid', async () => {
      const couponCode = generate.id();
      const fetch = stubFetch('api', 'get').resolves('true');

      const result = await client.validateCoupon(couponCode);

      expect(result).to.be.true;
      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/coupon/${couponCode}`);
    });
  });
});

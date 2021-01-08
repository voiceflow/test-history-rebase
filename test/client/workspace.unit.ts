import memberAdapter from '@/client/adapters/member';
import workspaceAdapter from '@/client/adapters/workspace';
import client, { LEGACY_WORKSPACE_PATH, WORKSPACES_PATH } from '@/client/workspace';
import { generate } from '@/utils/testing';

import suite from './_suite';

const WORKSPACE_ID = generate.id();

suite('Client - Workspace', ({ expect, stubFetch, stubAdapter }) => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).to.have.members([
      'find',
      'fetchWorkspace',
      'createWorkspace',
      'findMembers',
      'updateMembers',
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
    ]);
  });

  describe('find()', () => {
    it('should find all workspaces', async () => {
      const dbWorkspaces = generate.array<any>(3, generate.object);
      const [workspaces, mapWorkspacesFromDB] = stubAdapter(workspaceAdapter, 'mapFromDB', generate.array);
      const fetch = stubFetch('api').resolves(dbWorkspaces);

      const result = await client.find();

      expect(result).to.eq(workspaces);
      expect(fetch).to.be.calledWithExactly(WORKSPACES_PATH);
      expect(mapWorkspacesFromDB).to.be.calledWithExactly(dbWorkspaces);
    });
  });

  describe('fetchWorkspace()', () => {
    it('should get a workspace by its ID', async () => {
      const dbWorkspace = generate.object();
      const [workspace, workspaceFromDB] = stubAdapter(workspaceAdapter, 'fromDB', generate.object);
      const fetch = stubFetch('api').resolves(dbWorkspace);

      const result = await client.fetchWorkspace(WORKSPACE_ID);

      expect(result).to.eql([workspace]);
      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}`);
      expect(workspaceFromDB).to.be.calledWithExactly(dbWorkspace);
    });
  });

  describe('createWorkspace()', () => {
    it('should create a new workspace', async () => {
      const payload: any = generate.object();
      const dbWorkspace: any = generate.object();
      const [workspace, workspaceFromDB] = stubAdapter(workspaceAdapter, 'fromDB', generate.object);
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

  describe('updateMembers()', () => {
    it('should update members', async () => {
      const payload: any = generate.object();
      const fetch = stubFetch('api', 'patch');

      await client.updateMembers(WORKSPACE_ID, payload);

      expect(fetch).to.be.calledWithExactly(`${LEGACY_WORKSPACE_PATH}/${WORKSPACE_ID}/members`, payload);
    });
  });
});

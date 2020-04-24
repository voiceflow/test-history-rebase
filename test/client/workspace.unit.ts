import memberAdapter from '@/client/adapters/member';
import workspaceAdapter from '@/client/adapters/workspace';
import client, { LEGACY_WORKSPACE_PATH, WORKSPACES_PATH } from '@/client/workspace';
import { generate } from '@/utils/testing';

import suite from './_suite';

const WORKSPACE_ID = generate.id();

suite('Client - Workspace', ({ expect, stubFetch, expectCall }) => {
  describe('find()', () => {
    it('should find all workspaces', async () => {
      const mockWorkspaces: any[] = generate.array(3, generate.object);
      const fetch = stubFetch().resolves(mockWorkspaces);

      await expectCall(client.find).withListAdapter(workspaceAdapter, mockWorkspaces).toYield();

      expect(fetch).to.be.calledWithExactly(WORKSPACES_PATH);
    });
  });

  describe('fetchWorkspace()', () => {
    it('should get a workspace by its ID', async () => {
      const mockWorkspace = generate.object();
      const fetch = stubFetch().resolves(mockWorkspace);

      await expectCall(client.fetchWorkspace, WORKSPACE_ID).withAdapter(workspaceAdapter, mockWorkspace).toYield([mockWorkspace]);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}`);
    });
  });

  describe('createWorkspace()', () => {
    it('should create a new workspace', async () => {
      const data: any = generate.object();
      const fetch = stubFetch('post').resolves(data);

      await expectCall(client.createWorkspace, data).withAdapter(workspaceAdapter, data).toYield();

      expect(fetch).to.be.calledWithExactly(WORKSPACES_PATH, data);
    });
  });

  describe('findMembers()', () => {
    it('should create a new workspace', async () => {
      const mockMembers: any[] = generate.array(3, generate.object);
      const fetch = stubFetch().resolves(mockMembers);

      await expectCall(client.findMembers, WORKSPACE_ID).withListAdapter(memberAdapter, mockMembers).toYield();

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${WORKSPACE_ID}/members`);
    });
  });

  describe('updateMembers()', () => {
    it('should update members', async () => {
      const data: any = generate.object();
      const fetch = stubFetch('patch');

      await expectCall(client.updateMembers, WORKSPACE_ID, data).toYield();

      expect(fetch).to.be.calledWithExactly(`${LEGACY_WORKSPACE_PATH}/${WORKSPACE_ID}/members`, data);
    });
  });
});

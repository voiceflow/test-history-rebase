import memberAdapter from '@/client/adapters/member';
import workspaceAdapter from '@/client/adapters/workspace';
import client, { LEGACY_WORKSPACE_PATH, WORKSPACES_PATH } from '@/client/workspace';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Workspace', ({ expect, stub, stubFetch, expectCall }) => {
  describe('find()', () => {
    it('should find all workspaces', async () => {
      const mockWorkspaces = generate.array(3, generate.object);
      const fetch = stubFetch().yields(mockWorkspaces);

      await expectCall(client.find)
        .withAdapter(stub(workspaceAdapter, 'mapFromDB'))
        .toYield(mockWorkspaces);

      expect(fetch).to.be.calledWithExactly(WORKSPACES_PATH);
    });
  });

  describe('fetchWorkspace()', () => {
    it('should get a workspace by its ID', async () => {
      const workspaceID = generate.string();
      const mockWorkspace = generate.object();
      const fetch = stubFetch().yields(mockWorkspace);

      await expectCall(client.fetchWorkspace, workspaceID)
        .withAdapter(stub(workspaceAdapter, 'mapFromDB'))
        .toYield([mockWorkspace]);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${workspaceID}`);
    });
  });

  describe('createWorkspace()', () => {
    it('should create a new workspace', async () => {
      const data = generate.object();
      const fetch = stubFetch('post').yields(data);

      await expectCall(client.createWorkspace, data)
        .withAdapter(stub(workspaceAdapter, 'fromDB'))
        .toYield(data);

      expect(fetch).to.be.calledWithExactly(WORKSPACES_PATH, data);
    });
  });

  describe('findMembers()', () => {
    it('should create a new workspace', async () => {
      const workspaceID = generate.string();
      const mockMembers = generate.array(3, generate.object);
      const fetch = stubFetch().yields(mockMembers);

      await expectCall(client.findMembers, workspaceID)
        .withAdapter(stub(memberAdapter, 'mapFromDB'))
        .toYield(mockMembers);

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${workspaceID}/members`);
    });
  });

  describe('updateMembers()', () => {
    it('should update members', async () => {
      const workspaceID = generate.string();
      const members = generate.array(3, generate.object);
      const fetch = stubFetch('patch');

      await expectCall(client.updateMembers, workspaceID, members).toYield();

      expect(fetch).to.be.calledWithExactly(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/members`, members);
    });
  });
});

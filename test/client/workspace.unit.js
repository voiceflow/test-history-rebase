import memberAdapter from '@/client/adapters/member';
import workspaceAdapter from '@/client/adapters/workspace';
import client, { LEGACY_WORKSPACE_PATH, WORKSPACES_PATH } from '@/client/workspace';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Workspace', ({ expect, stub, ...utils }) => {
  describe('find()', () => {
    it('should should find all workspaces', async () => {
      const mockWorkspaces = generate.array(3, generate.object);
      const fetch = utils.stubFetch(mockWorkspaces);

      await utils.expectResult(() => client.find(), mockWorkspaces, stub(workspaceAdapter, 'mapFromDB'));

      expect(fetch).to.be.calledWithExactly(WORKSPACES_PATH);
    });
  });

  describe('fetchWorkspace()', () => {
    it('should get a workspace by its ID', async () => {
      const workspaceID = generate.string();
      const mockWorkspace = generate.object();
      const fetch = utils.stubFetch(mockWorkspace);

      await utils.expectResult(() => client.fetchWorkspace(workspaceID), [mockWorkspace], stub(workspaceAdapter, 'mapFromDB'));

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${workspaceID}`);
    });
  });

  describe('createWorkspace()', () => {
    it('should create a new workspace', async () => {
      const data = generate.object();
      const fetch = utils.stubFetch('post', data);

      await utils.expectResult(() => client.createWorkspace(data), data, stub(workspaceAdapter, 'fromDB'));

      expect(fetch).to.be.calledWithExactly(WORKSPACES_PATH, data);
    });
  });

  describe('findMembers()', () => {
    it('should create a new workspace', async () => {
      const workspaceID = generate.string();
      const mockMembers = generate.array(3, generate.object);
      const fetch = utils.stubFetch(mockMembers);

      await utils.expectResult(() => client.findMembers(workspaceID), mockMembers, stub(memberAdapter, 'mapFromDB'));

      expect(fetch).to.be.calledWithExactly(`${WORKSPACES_PATH}/${workspaceID}/members`);
    });
  });

  describe('updateMembers()', () => {
    it('should update members', async () => {
      const workspaceID = generate.string();
      const members = generate.array(3, generate.object);
      const fetch = utils.stubFetch('patch', true);

      await utils.expectResult(() => client.updateMembers(workspaceID, members));

      expect(fetch).to.be.calledWithExactly(`${LEGACY_WORKSPACE_PATH}/${workspaceID}/members`, members);
    });
  });
});

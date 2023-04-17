import * as Channels from '@ml-sdk/channels';
import { expect } from 'chai';

describe('Channels', () => {
  describe('user', () => {
    it('builds a channel pattern based off its known arguments', () => {
      expect(Channels.creator.buildMatcher()).to.eq('creator/:creatorID');
    });

    it('builds a channel using provided arguments', () => {
      expect(Channels.creator.build({ creatorID: '123' })).to.eq('creator/123');
    });
  });

  describe('workspace', () => {
    it('builds a channel pattern based off its known arguments', () => {
      expect(Channels.workspace.buildMatcher()).to.eq('workspace/:workspaceID');
    });

    it('builds a channel using provided arguments', () => {
      expect(Channels.workspace.build({ workspaceID: '123' })).to.eq('workspace/123');
    });
  });

  describe('project', () => {
    it('builds a channel pattern based off its known arguments', () => {
      expect(Channels.project.buildMatcher()).to.eq('workspace/:workspaceID/project/:projectID');
    });

    it('builds a channel using provided arguments', () => {
      expect(Channels.project.build({ workspaceID: '123', projectID: '456' })).to.eq('workspace/123/project/456');
    });
  });

  describe('diagram', () => {
    it('builds a channel pattern based off its known arguments', () => {
      expect(Channels.diagram.buildMatcher()).to.eq('workspace/:workspaceID/project/:projectID/diagram/:diagramID');
    });

    it('builds a channel using provided arguments', () => {
      // eslint-disable-next-line no-secrets/no-secrets
      expect(Channels.diagram.build({ workspaceID: '123', projectID: '456', diagramID: '789' })).to.eq('workspace/123/project/456/diagram/789');
    });
  });
});

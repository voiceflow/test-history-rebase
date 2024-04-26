import * as Channels from '@realtime-sdk/channels';

describe('Channels', () => {
  describe('user', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.creator.buildMatcher()).to.eq('creator/:creatorID');
    });

    it('build a channel using provided arguments', () => {
      expect(Channels.creator.build({ creatorID: '123' })).to.eq('creator/123');
    });
  });

  describe('workspace', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.workspace.buildMatcher()).to.eq('workspace/:workspaceID');
    });

    it('build a channel using provided arguments', () => {
      expect(Channels.workspace.build({ workspaceID: '123' })).to.eq('workspace/123');
    });
  });

  describe('project', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.project.buildMatcher()).to.eq('workspace/:workspaceID/project/:projectID');
    });

    it('build a channel using provided arguments', () => {
      expect(Channels.project.build({ workspaceID: '123', projectID: '456' })).to.eq('workspace/123/project/456');
    });
  });

  describe('version', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.version.buildMatcher()).to.eq('workspace/:workspaceID/project/:projectID/version/:versionID');
    });

    it('build a channel using provided arguments', () => {
      expect(Channels.version.build({ workspaceID: '123', projectID: '456', versionID: '789' })).to.eq(
        'workspace/123/project/456/version/789'
      );
    });
  });

  describe('diagram', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.diagram.buildMatcher()).to.eq(
        'workspace/:workspaceID/project/:projectID/version/:versionID/domain/:domainID/diagram/:diagramID'
      );
    });

    it('build a channel using provided arguments', () => {
      expect(
        Channels.diagram.build({
          workspaceID: '123',
          projectID: '456',
          versionID: '789',
          diagramID: '000',
          domainID: '007',
        })
      ).to.eq(
        // eslint-disable-next-line no-secrets/no-secrets
        'workspace/123/project/456/version/789/domain/007/diagram/000'
      );
    });
  });
});

import { describe, expect, it } from 'vitest';

import * as Channels from '@/channels';

describe('Channels', () => {
  describe('user', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.creator.buildMatcher()).toBe('creator/:creatorID');
    });

    it('build a channel using provided arguments', () => {
      expect(Channels.creator.build({ creatorID: '123' })).toBe('creator/123');
    });
  });

  describe('workspace', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.workspace.buildMatcher()).toBe('workspace/:workspaceID');
    });

    it('build a channel using provided arguments', () => {
      expect(Channels.workspace.build({ workspaceID: '123' })).toBe('workspace/123');
    });
  });

  describe('project', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.project.buildMatcher()).toBe('workspace/:workspaceID/project/:projectID');
    });

    it('build a channel using provided arguments', () => {
      expect(Channels.project.build({ workspaceID: '123', projectID: '456' })).toBe('workspace/123/project/456');
    });
  });

  describe('version', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.version.buildMatcher()).toBe('workspace/:workspaceID/project/:projectID/version/:versionID');
    });

    it('build a channel using provided arguments', () => {
      expect(Channels.version.build({ workspaceID: '123', projectID: '456', versionID: '789' })).toBe(
        'workspace/123/project/456/version/789'
      );
    });
  });

  describe('diagram', () => {
    it('build a channel pattern based off its known arguments', () => {
      expect(Channels.diagram.buildMatcher()).toBe(
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
      ).toBe('workspace/123/project/456/version/789/domain/007/diagram/000');
    });
  });
});

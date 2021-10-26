import { CREATOR_KEY, DIAGRAM_KEY, PROJECT_KEY, VERSION_KEY, WORKSPACE_KEY } from '../constants';
import { ChannelParams, createChannel } from './utils';

export type { Channel } from './utils';

export const creator = createChannel(['creatorID'], ({ creatorID }) => `${CREATOR_KEY}/${creatorID}`);
export type CreatorChannelParams = ChannelParams<typeof creator>;

export const workspace = createChannel(['workspaceID'], ({ workspaceID }) => `${WORKSPACE_KEY}/${workspaceID}`);
export type WorkspaceChannelParams = ChannelParams<typeof workspace>;

export const project = workspace.extend(['projectID'], ({ projectID }) => `${PROJECT_KEY}/${projectID}`);
export type ProjectChannelParams = ChannelParams<typeof project>;

export const version = project.extend(['versionID'], ({ versionID }) => `${VERSION_KEY}/${versionID}`);
export type VersionChannelParams = ChannelParams<typeof version>;

export const diagram = project.extend(['diagramID'], ({ diagramID }) => `${DIAGRAM_KEY}/${diagramID}`);
export type DiagramChannelParams = ChannelParams<typeof diagram>;

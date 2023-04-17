import { Utils } from '@voiceflow/common';

import { CREATOR_KEY, DIAGRAM_KEY, PROJECT_KEY, WORKSPACE_KEY } from './constants';

export const creator = Utils.protocol.createChannel(['creatorID'], ({ creatorID }) => `${CREATOR_KEY}/${creatorID}`);
export type CreatorChannelParams = Utils.protocol.ChannelParams<typeof creator>;

export const workspace = Utils.protocol.createChannel(['workspaceID'], ({ workspaceID }) => `${WORKSPACE_KEY}/${workspaceID}`);
export type WorkspaceChannelParams = Utils.protocol.ChannelParams<typeof workspace>;

export const project = workspace.extend(['projectID'], ({ projectID }) => `${PROJECT_KEY}/${projectID}`);
export type ProjectChannelParams = Utils.protocol.ChannelParams<typeof project>;

export const diagram = project.extend(['diagramID'], ({ diagramID }) => `${DIAGRAM_KEY}/${diagramID}`);
export type DiagramChannelParams = Utils.protocol.ChannelParams<typeof diagram>;

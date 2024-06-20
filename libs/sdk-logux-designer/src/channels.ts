import { Utils } from '@voiceflow/common';

export const creator = Utils.protocol.createChannel(['creatorID'], ({ creatorID }) => `creator/${creatorID}`);
export type CreatorParams = Utils.protocol.ChannelParams<typeof creator>;

export const workspace = Utils.protocol.createChannel(['workspaceID'], ({ workspaceID }) => `workspace/${workspaceID}`);
export type WorkspaceParams = Utils.protocol.ChannelParams<typeof workspace>;

// FIXME: remove workspaceID once we have users under organization
export const organization = Utils.protocol.createChannel(
  ['organizationID', 'workspaceID'],
  ({ organizationID, workspaceID }) => `organization/${organizationID}/${workspaceID}`
);

export type OrganizationParams = Utils.protocol.ChannelParams<typeof organization>;

export const assistant = Utils.protocol.createChannel(
  ['assistantID', 'environmentID'],
  ({ assistantID, environmentID }) => `assistant/${assistantID}/environment/${environmentID}`
);
export type AssistantParams = Utils.protocol.ChannelParams<typeof assistant>;

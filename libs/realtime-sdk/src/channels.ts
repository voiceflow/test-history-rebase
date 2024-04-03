import { Utils } from '@voiceflow/common';

import { CREATOR_KEY, DIAGRAM_KEY, DOMAIN_KEY, ORGANIZATION_KEY, PROJECT_KEY, SCHEMA_KEY, VERSION_KEY, WORKSPACE_KEY } from './constants';

export const creator = Utils.protocol.createChannel(['creatorID'], ({ creatorID }) => `${CREATOR_KEY}/${creatorID}`);
export type CreatorChannelParams = Utils.protocol.ChannelParams<typeof creator>;

export const schema = Utils.protocol.createChannel(['versionID'], ({ versionID }) => `${SCHEMA_KEY}/${versionID}`);
export type SchemaChannelParams = Utils.protocol.ChannelParams<typeof schema>;

export const organization = Utils.protocol.createChannel(['organizationID'], ({ organizationID }) => `${ORGANIZATION_KEY}/${organizationID}`);
export type OrganizationChannelParams = Utils.protocol.ChannelParams<typeof organization>;

export const workspace = Utils.protocol.createChannel(['workspaceID'], ({ workspaceID }) => `${WORKSPACE_KEY}/${workspaceID}`);
export type WorkspaceChannelParams = Utils.protocol.ChannelParams<typeof workspace>;

export const project = workspace.extend(['projectID'], ({ projectID }) => `${PROJECT_KEY}/${projectID}`);
export type ProjectChannelParams = Utils.protocol.ChannelParams<typeof project>;

export const version = project.extend(['versionID'], ({ versionID }) => `${VERSION_KEY}/${versionID}`);
export type VersionChannelParams = Utils.protocol.ChannelParams<typeof version>;

export const diagram = version.extend(
  ['diagramID', 'domainID'],
  ({ domainID, diagramID }) => `${DOMAIN_KEY}/${domainID}/${DIAGRAM_KEY}/${diagramID}`
);

export type DiagramChannelParams = Utils.protocol.ChannelParams<typeof diagram>;

export const diagramV2 = version.extend(['diagramID'], ({ diagramID }) => `${DIAGRAM_KEY}/${diagramID}`);

export type DiagramChannelV2Params = Utils.protocol.ChannelParams<typeof diagramV2>;

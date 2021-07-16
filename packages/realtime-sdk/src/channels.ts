import { DIAGRAM_KEY, PROJECT_KEY, VERSION_KEY, WORKSPACE_KEY } from './constants';

export interface WorkspaceChannelParams {
  workspaceID: string;
}

export interface ProjectChannelParams {
  projectID: string;
}

export interface VersionChannelParams extends ProjectChannelParams {
  versionID: string;
}

export interface DiagramChannelParams extends ProjectChannelParams {
  diagramID: string;
}

export const workspace = ({ workspaceID }: WorkspaceChannelParams): string => `${WORKSPACE_KEY}/${workspaceID}`;

export const project = ({ projectID }: ProjectChannelParams): string => `${PROJECT_KEY}/${projectID}`;

export const version = ({ versionID, ...params }: VersionChannelParams): string => `${project(params)}/${VERSION_KEY}/${versionID}`;

export const diagram = ({ diagramID, ...params }: DiagramChannelParams): string => `${project(params)}/${DIAGRAM_KEY}/${diagramID}`;

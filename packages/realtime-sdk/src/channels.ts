import { CREATOR_KEY, DIAGRAM_KEY, PROJECT_KEY, WORKSPACE_KEY } from './constants';

export interface CreatorChannelParams {
  creatorID: number;
}

export interface WorkspaceChannelParams {
  workspaceID: string;
}

export interface ProjectChannelParams extends WorkspaceChannelParams {
  projectID: string;
}

export interface DiagramChannelParams extends ProjectChannelParams {
  diagramID: string;
}

export const creator = ({ creatorID }: CreatorChannelParams): string => `${CREATOR_KEY}/${creatorID}`;

export const workspace = ({ workspaceID }: WorkspaceChannelParams): string => `${WORKSPACE_KEY}/${workspaceID}`;

export const project = ({ projectID, ...params }: ProjectChannelParams): string => `${workspace(params)}/${PROJECT_KEY}/${projectID}`;

export const diagram = ({ diagramID, ...params }: DiagramChannelParams): string => `${project(params)}/${DIAGRAM_KEY}/${diagramID}`;

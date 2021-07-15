import { DIAGRAM_KEY, PROJECT_KEY, VERSION_KEY, WORKSPACE_KEY } from './constants';

export const workspace = ({ workspaceID }: { workspaceID: string }) => `${WORKSPACE_KEY}/${workspaceID}`;

export const project = ({ projectID }: { projectID: string }) => `${PROJECT_KEY}/${projectID}`;

export const version = ({ versionID }: { versionID: string }) => `${VERSION_KEY}/${versionID}`;

export const diagram = ({ diagramID }: { diagramID: string }) => `${DIAGRAM_KEY}/${diagramID}`;

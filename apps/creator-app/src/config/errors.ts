import { Nullish, Struct } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

export class StateInvariantError<T extends Struct = {}> extends Error {
  constructor(message: string, public data?: T) {
    super(message);
  }
}

export const error = <T extends Struct = {}>(message: string, data?: T): StateInvariantError<T> => new StateInvariantError<T>(message, data);

export const noActiveCreatorID = (): StateInvariantError => error('no active creator ID');

export const noActiveWorkspaceID = (): StateInvariantError => error('no active workspace ID');

export const noOrganizationID = (): StateInvariantError => error('no active organization ID');

export const noActiveProjectID = (): StateInvariantError => error('no active project ID');

export const noActiveVersionID = (): StateInvariantError => error('no active version ID');

export const noCancasTemplateID = (): StateInvariantError => error('no canvas template ID');

export const noActiveDiagramID = (): StateInvariantError => error('no active diagram ID');

export const noActiveDomainID = (): StateInvariantError => error('no active domain ID');

export const noActivePlatform = (): StateInvariantError => error('no active platform');

export const noProjectListByID = (projectListID: string): StateInvariantError<{ projectListID: string }> =>
  error(`no project list found with ID: ${projectListID}`, { projectListID });

export const noProjectByID = (projectID: string): StateInvariantError<{ projectID: string }> =>
  error(`no project found with ID: ${projectID}`, { projectID });

export const noVersionByID = (versionID: string): StateInvariantError<{ versionID: string }> =>
  error(`no version found with ID: ${versionID}`, { versionID });

export const assert: <T>(value: Nullish<T>, error: StateInvariantError) => asserts value is T = (value, error) => {
  if (!value) throw error;
};

export const assertCreatorID: (id: Nullish<number>) => asserts id is number = (id) => {
  assert(id, noActiveCreatorID());
};

export const assertWorkspaceID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noActiveWorkspaceID());
};

export const assertOrganizationID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noOrganizationID());
};

export const assertProjectID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noActiveProjectID());
};

export const assertVersionID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noActiveVersionID());
};

export const assertCanvasTemplateID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noCancasTemplateID());
};

export const assertDiagramID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noActiveDiagramID());
};

export const assertDomainID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noActiveDomainID());
};

export const assertPlatform: (platform: Nullish<Platform.Constants.PlatformType>) => asserts platform is Platform.Constants.PlatformType = (
  platform
) => {
  assert(platform, noActivePlatform());
};

export const assertProjectList: (projectListID: string, product: Nullish<Realtime.ProjectList>) => asserts product is Realtime.ProjectList = (
  projectListID,
  projectList
) => {
  assert(projectList, noProjectListByID(projectListID));
};

export const assertProject: (projectID: string, project: Nullish<Realtime.AnyProject>) => asserts project is Realtime.AnyProject = (
  projectID,
  project
) => {
  assert(project, noProjectByID(projectID));
};

export const assertVersion: (
  versionID: string,
  version: Nullish<Platform.Base.Models.Version.Model>
) => asserts version is Platform.Base.Models.Version.Model = (versionID, version) => {
  assert(version, noVersionByID(versionID));
};

// Test comment

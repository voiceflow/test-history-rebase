import { Nullish, Struct } from '@voiceflow/common';

import { AnyProject, AnyVersion, Product, ProjectList } from '@/models';

class StateInvariantError<T extends Struct = {}> extends Error {
  constructor(message: string, public data?: T) {
    super(message);
  }
}

export const error = <T extends Struct = {}>(message: string, data?: T): StateInvariantError<T> => new StateInvariantError<T>(message, data);

export const noActiveCreatorID = (): StateInvariantError => error('no active creator ID');

export const noActiveWorkspaceID = (): StateInvariantError => error('no active workspace ID');

export const noActiveProjectID = (): StateInvariantError => error('no active project ID');

export const noActiveVersionID = (): StateInvariantError => error('no active version ID');

export const noActiveDiagramID = (): StateInvariantError => error('no active diagram ID');

export const noProductByID = (productID: string): StateInvariantError<{ productID: string }> =>
  error(`no product found with ID: ${productID}`, { productID });

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

export const assertProjectID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noActiveProjectID());
};

export const assertVersionID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noActiveVersionID());
};

export const assertDiagramID: (id: Nullish<string>) => asserts id is string = (id) => {
  assert(id, noActiveDiagramID());
};

export const assertProduct: (productID: string, product: Nullish<Product>) => asserts product is Product = (productID, product) => {
  assert(product, noProductByID(productID));
};

export const assertProjectList: (projectListID: string, product: Nullish<ProjectList>) => asserts product is ProjectList = (
  projectListID,
  projectList
) => {
  assert(projectList, noProjectListByID(projectListID));
};

export const assertProject: (projectID: string, project: Nullish<AnyProject>) => asserts project is AnyProject = (projectID, project) => {
  assert(project, noProjectByID(projectID));
};

export const assertVersion: (versionID: string, version: Nullish<AnyVersion>) => asserts version is AnyVersion = (versionID, version) => {
  assert(version, noVersionByID(versionID));
};

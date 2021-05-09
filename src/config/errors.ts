import { Nullish } from '@/types';

class StateInvariantError extends Error {}

export const noActiveCreatorID = () => new StateInvariantError('no active creator ID');

export const noActiveWorkspaceID = () => new StateInvariantError('no active workspace ID');

export const noActiveProjectID = () => new StateInvariantError('no active project ID');

export const noActiveVersionID = () => new StateInvariantError('no active version ID');

export const noActiveDiagramID = () => new StateInvariantError('no active diagram ID');

export const assertCreatorID: (id: Nullish<number>) => asserts id is number = (id) => {
  if (!id) throw noActiveCreatorID();
};

export const assertWorkspaceID: (id: Nullish<string>) => asserts id is string = (id) => {
  if (!id) throw noActiveWorkspaceID();
};

export const assertProjectID: (id: Nullish<string>) => asserts id is string = (id) => {
  if (!id) throw noActiveProjectID();
};

export const assertVersionID: (id: Nullish<string>) => asserts id is string = (id) => {
  if (!id) throw noActiveVersionID();
};

export const assertDiagramID: (id: Nullish<string>) => asserts id is string = (id) => {
  if (!id) throw noActiveDiagramID();
};

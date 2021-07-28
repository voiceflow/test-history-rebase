import { Nullish } from '@/types';

class StateInvariantError extends Error {}

export const error = (message: string): StateInvariantError => new StateInvariantError(message);

export const noActiveCreatorID = (): StateInvariantError => error('no active creator ID');

export const noActiveWorkspaceID = (): StateInvariantError => error('no active workspace ID');

export const noActiveProjectID = (): StateInvariantError => error('no active project ID');

export const noActiveVersionID = (): StateInvariantError => error('no active version ID');

export const noActiveDiagramID = (): StateInvariantError => error('no active diagram ID');

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

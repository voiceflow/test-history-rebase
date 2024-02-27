import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Patch } from 'immer';

export const getUpdatedDiagrams = ({ diagrams }: Realtime.Migrate.MigrationData, patches: Patch[]) => {
  const data: Record<number, Realtime.Migrate.DiagramUpdateData> = {};

  const isSupportedPath = (path: Array<string | number>): path is ['diagrams', number] => path[0] === 'diagrams' && typeof path[1] === 'number';

  patches.forEach(({ path }) => {
    if (!isSupportedPath(path)) return;

    const [, index] = path;

    data[index] = diagrams[index];
  });

  return Object.values(data);
};

import type { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import { waitAsync } from '@/ducks/utils';
import type { ActiveVersionContext } from '@/ducks/versionV2/utils';
import { assertVersionContext, getActiveVersionContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

// side effects

export const createTemplateDiagram = (): Thunk<string> => async (dispatch, getState) => {
  const state = getState();

  const diagram = await dispatch(
    waitAsync(Realtime.diagram.templateCreate, {
      ...getActiveVersionContext(state),
      template: { name: 'Template Diagram' },
    })
  );

  return diagram.diagramID;
};

export const renameDiagram =
  (diagramID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.diagram.crud.patch({ ...getActiveVersionContext(getState()), key: diagramID, value: { name } })
    );
  };

export const diagramHeartbeat =
  (
    { diagramID, ...context }: ActiveVersionContext & { diagramID: Nullable<string> },
    data: {
      lock: Nullable<{ type: Realtime.diagram.awareness.LockEntityType; entityIDs: string[] }>;
      unlock: Nullable<{ type: Realtime.diagram.awareness.LockEntityType; entityIDs: string[] }>;
      locksMap: Realtime.diagram.awareness.HeartbeatLocksMap;
      forceSync: boolean;
    }
  ): Thunk =>
  async (dispatch) => {
    Errors.assertDiagramID(diagramID);

    const ctx = { ...context };

    assertVersionContext(ctx);

    await dispatch.sync(Realtime.diagram.awareness.heartbeat({ diagramID, ...ctx, ...data }));
  };

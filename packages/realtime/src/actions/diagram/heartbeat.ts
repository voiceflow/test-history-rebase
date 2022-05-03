import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from './utils';

class HeartbeatControl extends AbstractDiagramActionControl<Realtime.diagram.awareness.HeartbeatPayload> {
  actionCreator = Realtime.diagram.awareness.heartbeat;

  protected process = async (ctx: Context, { payload }: Action<Realtime.diagram.awareness.HeartbeatPayload>) => {
    const { diagramID, projectID, versionID, locksMap, workspaceID } = payload;

    await Promise.all([
      this.services.diagram.connectNode(diagramID, ctx.nodeId),
      this.services.project.connectDiagram(projectID, diagramID),
      this.services.migrate.renewActiveSchemaVersion(versionID),
      ...Object.entries(locksMap).map(([lockType, entities]) => this.services.lock.lockEntities(diagramID, ctx.nodeId, lockType, entities)),
    ]);

    const [viewers, diagramLocks] = await Promise.all([
      this.services.diagram.getConnectedViewers(diagramID),
      this.services.lock.getAllLocks<Realtime.diagram.awareness.LockEntityType>(diagramID),
    ]);

    const context = { diagramID, projectID, versionID, workspaceID };

    await Promise.all([
      ctx.sendBack(Realtime.project.awareness.updateViewers({ ...context, viewers })),
      ctx.sendBack(Realtime.diagram.awareness.updateLockedEntities({ ...context, locks: diagramLocks })),
    ]);
  };
}

export default HeartbeatControl;

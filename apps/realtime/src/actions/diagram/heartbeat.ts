import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from './utils';

class HeartbeatControl extends AbstractDiagramActionControl<Realtime.diagram.awareness.HeartbeatPayload> {
  actionCreator = Realtime.diagram.awareness.heartbeat;

  protected process = async (ctx: Context, { payload }: Action<Realtime.diagram.awareness.HeartbeatPayload>) => {
    const { lock, unlock, forceSync, diagramID, projectID, domainID, versionID, locksMap, workspaceID } = payload;

    await Promise.all([
      this.services.diagram.connectNode(diagramID, ctx.nodeId),
      this.services.project.connectDiagram(projectID, diagramID),
      this.services.workspace.connectProject(workspaceID, projectID),
      this.services.viewer.renewEntityExpire(ctx.userId),
      this.services.migrate.renewActiveSchemaVersion(versionID),
      ...Object.entries(locksMap).map(([lockType, entities]) => this.services.lock.lockEntities(diagramID, ctx.nodeId, lockType, entities)),
    ]);

    const context = { diagramID, domainID, projectID, versionID, loguxNodeID: ctx.nodeId, workspaceID };

    if (lock) {
      // don't need to lock entities in the redis since it's already locked above
      await this.server.processAs(
        ctx.data.creatorID,
        Realtime.diagram.awareness.lockEntities({ ...context, lockType: lock.type, entityIDs: lock.entityIDs })
      );
    }

    if (unlock) {
      await this.services.lock.unlockEntities(diagramID, ctx.nodeId, unlock.type, unlock.entityIDs);

      await this.server.processAs(
        ctx.data.creatorID,
        Realtime.diagram.awareness.unlockEntities({ ...context, lockType: unlock.type, entityIDs: unlock.entityIDs })
      );
    }

    // skip force sync if not requested by timeout
    if (!forceSync) return;

    const [viewers, diagramLocks] = await Promise.all([
      this.services.diagram.getConnectedViewers(diagramID),
      this.services.lock.getAllLocks<Realtime.diagram.awareness.LockEntityType>(diagramID),
    ]);

    await Promise.all([
      ctx.sendBack(Realtime.project.awareness.updateDiagramViewers({ ...context, viewers })),
      ctx.sendBack(Realtime.diagram.awareness.updateLockedEntities({ ...context, locks: diagramLocks })),
    ]);
  };
}

export default HeartbeatControl;

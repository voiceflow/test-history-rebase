import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

class DuplicateDomain extends AbstractDomainResourceControl<Realtime.BaseDomainPayload> {
  protected actionCreator = Realtime.domain.duplicate.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.domain.duplicate, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { domainID, versionID, projectID, workspaceID } = payload;

    const { domain: dbDomain, diagrams: dbDiagrams } = await this.services.domain.duplicate(creatorID, versionID, domainID);

    const domain = Realtime.Adapters.domainAdapter.fromDB(dbDomain);

    const clonedTopics = Realtime.Adapters.diagramAdapter.mapFromDB(dbDiagrams, {
      rootDiagramID: domain.rootDiagramID,

      // TODO: remove when clients are migrated to v1.3.0
      menuNodeIDs: !this.isGESubprotocol(ctx, Realtime.Subprotocol.Version.V1_3_0),
    });

    await Promise.all([
      this.reloadSharedNodes(ctx, payload, dbDiagrams),
      this.server.processAs(
        creatorID,
        Realtime.diagram.crud.addMany({
          values: clonedTopics,
          versionID,
          projectID,
          workspaceID,
        })
      ),
      this.server.processAs(
        creatorID,
        Realtime.domain.crud.add({
          key: domain.id,
          value: domain,
          versionID,
          projectID,
          workspaceID,
        })
      ),
    ]);

    return domain;
  });

  protected finally = async (ctx: Context, { payload }: Action<Realtime.BaseDomainPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default DuplicateDomain;

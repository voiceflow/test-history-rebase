import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import { terminateResend } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

class DuplicateDomain extends AbstractDomainResourceControl<Realtime.BaseDomainPayload> {
  protected actionCreator = Realtime.domain.duplicate.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.domain.duplicate, async (ctx, { payload }) => {
    const { creatorID, clientID } = ctx.data;
    const { domainID, versionID, projectID, workspaceID } = payload;

    if (!domainID) {
      throw new Error('domainID is required');
    }

    const { domain: dbDomain, diagrams: dbDiagrams } = await this.services.domain.duplicate(
      creatorID,
      versionID,
      domainID
    );

    const domain = Realtime.Adapters.domainAdapter.fromDB(dbDomain);

    const clonedTopics = Realtime.Adapters.diagramAdapter.mapFromDB(dbDiagrams, {
      rootDiagramID: domain.rootDiagramID,
    });

    await Promise.all([
      this.reloadSharedNodes(ctx, payload, dbDiagrams),
      this.server.processAs(
        creatorID,
        clientID,
        Realtime.diagram.crud.addMany({
          values: clonedTopics,
          versionID,
          projectID,
          workspaceID,
        })
      ),
      this.server.processAs(
        creatorID,
        clientID,
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

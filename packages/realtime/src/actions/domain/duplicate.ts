import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

class DuplicateDomain extends AbstractDomainResourceControl<Realtime.domain.BaseDomainPayload> {
  protected actionCreator = Realtime.domain.duplicate.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.domain.duplicate, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { domainID, versionID, projectID, workspaceID } = payload;

    const allDomains = await this.services.domain.getAll(versionID);
    const domainToClone = allDomains.find((domain) => domain.id === domainID);

    if (!domainToClone) {
      throw new Error(`Domain with id ${domainID} not found!`);
    }

    const clonedDBTopics = await this.services.diagram.cloneMany(creatorID, versionID, domainToClone.topicIDs);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(
      domainToClone.name,
      allDomains.map((domain) => domain.name)
    );

    const clonedDBDomain = await this.services.domain.create(versionID, {
      ...domainToClone,
      id: Utils.id.objectID(),
      name: uniqueName,
      topicIDs: clonedDBTopics.map((topic) => topic._id),
      updatedAt: new Date().toJSON(),
      rootDiagramID: clonedDBTopics[domainToClone.topicIDs.indexOf(domainToClone.rootDiagramID)]._id,
      updatedBy: creatorID,
    });

    const clonedDomain = Realtime.Adapters.domainAdapter.fromDB(clonedDBDomain);

    await Promise.all([
      this.reloadSharedNodes(ctx, payload, clonedDBTopics),
      this.server.processAs(
        creatorID,
        Realtime.diagram.crud.addMany({
          values: Realtime.Adapters.diagramAdapter.mapFromDB(clonedDBTopics, { rootDiagramID: clonedDomain.rootDiagramID }),
          versionID,
          projectID,
          workspaceID,
        })
      ),
      this.server.processAs(
        creatorID,
        Realtime.domain.crud.add({
          key: clonedDomain.id,
          value: clonedDomain,
          versionID,
          projectID,
          workspaceID,
        })
      ),
    ]);

    return clonedDomain;
  });

  protected finally = async (ctx: Context, { payload }: Action<Realtime.domain.BaseDomainPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default DuplicateDomain;

import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

class CreateDomain extends AbstractDomainResourceControl<Realtime.domain.CreatePayload> {
  protected actionCreator = Realtime.domain.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.domain.create, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { domain, versionID, projectID, workspaceID } = payload;

    const newDBDiagram = await this.services.diagram.create({
      ...Realtime.Utils.diagram.rootTopicDiagramFactory('ROOT'),
      versionID,
      creatorID,
    });

    const newDiagram = Realtime.Adapters.diagramAdapter.fromDB(newDBDiagram, {
      rootDiagramID: newDBDiagram._id,

      // TODO: remove when clients are migrated to v1.3.0
      menuNodeIDs: !this.isGESubprotocol(ctx, Realtime.Subprotocol.Version.V1_3_0),
    });

    const newDBDomain = await this.services.domain.create(versionID, {
      ...domain,
      id: Utils.id.objectID(),
      topicIDs: [newDiagram.id],
      updatedAt: new Date().toJSON(),
      rootDiagramID: newDiagram.id,
      updatedBy: creatorID,
    });

    const newDomain = Realtime.Adapters.domainAdapter.fromDB(newDBDomain);

    await Promise.all([
      this.reloadSharedNodes(ctx, payload, [newDBDiagram]),
      this.server.processAs(
        creatorID,
        Realtime.diagram.crud.add({
          key: newDiagram.id,
          value: newDiagram,
          versionID,
          projectID,
          workspaceID,
        })
      ),
      this.server.processAs(
        creatorID,
        Realtime.domain.crud.add({
          key: newDomain.id,
          value: newDomain,
          versionID,
          projectID,
          workspaceID,
        })
      ),
    ]);

    return newDomain;
  });

  protected finally = async (ctx: Context, { payload }: Action<Realtime.domain.CreatePayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default CreateDomain;

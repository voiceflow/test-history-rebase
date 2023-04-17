import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { normalize } from 'normal-store';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '@/actions/diagram/utils';

export const findSignificantNodes = (nodesWithData: Realtime.NodeWithData[]) => {
  const rootNodeIDs: string[] = [];
  const markupNodeIDs: string[] = [];

  nodesWithData.forEach(({ node }) => {
    if (Realtime.Utils.typeGuards.isMarkupBlockType(node.type)) {
      markupNodeIDs.push(node.id);
      return;
    }

    if (!node.parentNode) {
      rootNodeIDs.push(node.id);
    }
  });

  return { rootNodeIDs, markupNodeIDs };
};

export const getDBNodes = <T extends Realtime.creator.ImportSnapshotPayload>(payload: T) => {
  const { diagramID, nodesWithData, ports, links, projectMeta } = payload;
  const { rootNodeIDs, markupNodeIDs } = findSignificantNodes(nodesWithData);

  const { nodes: dbNodes } = Realtime.Adapters.creatorAdapter.toDB(
    {
      diagramID,
      data: Object.fromEntries(nodesWithData.map(({ data }) => [data.nodeID, data])),
      rootNodeIDs,
      markupNodeIDs,
      links,

      // the rest of these can safely be left empty
      viewport: { x: 0, y: 0, zoom: 0 },
      nodes: [],
      ports: [],
    },
    {
      platform: projectMeta.platform,
      projectType: projectMeta.type,
      nodes: normalize(nodesWithData.map(({ node }) => node)),
      ports: normalize(ports),
      context: {
        schemaVersion: payload.schemaVersion,
      },
      partial: true,
    }
  );

  return dbNodes;
};

class ImportSnapshot extends AbstractDiagramResourceControl<Realtime.creator.ImportSnapshotPayload> {
  protected actionCreator = Realtime.creator.importSnapshot;

  protected process = async (ctx: Context, { payload }: Action<Realtime.creator.ImportSnapshotPayload>) => {
    const dbNodes = getDBNodes(payload);

    await this.services.diagram.addManyNodes(payload.diagramID, {
      nodes: Object.values(dbNodes),
      menuNodeIDs: !this.isGESubprotocol(ctx, Realtime.Subprotocol.Version.V1_3_0),
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.creator.ImportSnapshotPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default ImportSnapshot;

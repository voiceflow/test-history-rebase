import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import { normalize } from 'normal-store';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '@/legacy/actions/diagram/utils';

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
  const { nodesWithData, ports, links, projectMeta } = payload;
  const { rootNodeIDs, markupNodeIDs } = findSignificantNodes(nodesWithData);

  const { nodes: dbNodes } = Realtime.Adapters.creatorAdapter.toDB(
    {
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

  protected process = async (_ctx: Context, { payload }: Action<Realtime.creator.ImportSnapshotPayload>) => {
    const dbNodes = getDBNodes(payload);

    await this.services.diagram.addManyNodes(payload.versionID, payload.diagramID, { nodes: Object.values(dbNodes) });
  };

  protected finally = async (
    ctx: Context,
    { payload }: Action<Realtime.creator.ImportSnapshotPayload>
  ): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default ImportSnapshot;

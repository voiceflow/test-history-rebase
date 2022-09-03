import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class ComponentDuplicate extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload> {
  protected actionCreator = Realtime.diagram.componentDuplicate.started;

  protected process = this.reply(Realtime.diagram.componentDuplicate, async (ctx, { payload }) => {
    const { versionID, diagramID } = payload;

    const [dbDiagram, diagramNames] = await Promise.all([this.services.diagram.get(diagramID), this.services.diagram.getAllNames(versionID)]);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(dbDiagram.name, diagramNames);

    return this.createComponent(ctx, payload, { ...Utils.object.omit(dbDiagram, ['_id', 'creatorID', 'versionID']), name: uniqueName });
  });
}

export default ComponentDuplicate;

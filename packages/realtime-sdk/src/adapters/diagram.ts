import { DBDiagram, Diagram } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const diagramAdapter = createMultiAdapter<DBDiagram, Diagram, [{ rootDiagramID?: string; menuNodeIDs: boolean }]>(
  ({ _id, name, type, zoom, offsetX, offsetY, variables, menuItems = [], ...extra }, { menuNodeIDs, rootDiagramID }) => ({
    id: _id,
    name,
    type: type ?? (_id === rootDiagramID ? BaseModels.Diagram.DiagramType.TOPIC : BaseModels.Diagram.DiagramType.COMPONENT),
    zoom,
    offsetX,
    offsetY,
    variables,
    menuItems,
    // TODO: remove when not used, check in the datadog realtime version
    ...(menuNodeIDs && { menuNodeIDs: extra.menuNodeIDs ?? [] }),
  }),
  notImplementedAdapter.transformer
);

export default diagramAdapter;

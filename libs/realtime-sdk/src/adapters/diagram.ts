import { DBDiagram, Diagram } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const diagramAdapter = createMultiAdapter<DBDiagram, Diagram, [{ rootDiagramID?: string }] | []>(
  ({ _id, name, type, zoom, offsetX, offsetY, variables, menuItems = [] }, { rootDiagramID } = {}) => ({
    id: _id,
    name,
    type: type ?? (_id === rootDiagramID ? BaseModels.Diagram.DiagramType.TOPIC : BaseModels.Diagram.DiagramType.COMPONENT),
    zoom,
    offsetX,
    offsetY,
    variables,
    menuItems,
  }),
  notImplementedAdapter.transformer
);

export default diagramAdapter;

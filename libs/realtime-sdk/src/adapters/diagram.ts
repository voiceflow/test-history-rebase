import { DBDiagram, Diagram } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const diagramAdapter = createMultiAdapter<DBDiagram, Diagram>(
  ({ _id, name, type, zoom, offsetX, offsetY, variables, menuItems = [] }) => ({
    id: _id,
    name,
    type: type ?? BaseModels.Diagram.DiagramType.COMPONENT,
    zoom,
    offsetX,
    offsetY,
    variables,
    menuItems,
  }),
  notImplementedAdapter.transformer
);

export default diagramAdapter;

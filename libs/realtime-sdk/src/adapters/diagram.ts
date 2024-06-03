import { DBDiagram, Diagram } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const diagramAdapter = createMultiAdapter<DBDiagram, Diagram, [{ rootDiagramID?: string }] | []>(
  ({ diagramID, name, type, zoom, offsetX, offsetY, variables }, { rootDiagramID } = {}) => ({
    id: diagramID,
    diagramID,
    name,
    type: (type ??
      (diagramID === rootDiagramID
        ? BaseModels.Diagram.DiagramType.TOPIC
        : BaseModels.Diagram.DiagramType.COMPONENT)) as BaseModels.Diagram.DiagramType,
    zoom,
    offsetX,
    offsetY,
    variables,
  }),
  notImplementedAdapter.transformer
);

export default diagramAdapter;

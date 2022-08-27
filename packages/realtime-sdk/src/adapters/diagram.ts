import { DBDiagram, Diagram } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

// TODO: remove rootDiagramID when domains are released
const diagramAdapter = createAdapter<DBDiagram, Diagram, [{ rootDiagramID?: string }] | []>(
  ({ _id, name, type, children, variables, menuNodeIDs = [] }, { rootDiagramID } = {}) => ({
    id: _id,
    name,
    type: type ?? (rootDiagramID === _id ? BaseModels.Diagram.DiagramType.TOPIC : BaseModels.Diagram.DiagramType.COMPONENT),
    variables,
    menuNodeIDs,
    subDiagrams: children,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default diagramAdapter;

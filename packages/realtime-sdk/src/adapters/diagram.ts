import { Models as BaseModels } from '@voiceflow/base-types';

import { DBDiagram, Diagram } from '../models';
import { AdapterNotImplementedError, createAdapter } from './utils';

const diagramAdapter = createAdapter<DBDiagram, Diagram, [{ rootDiagramID: string }]>(
  ({ _id, name, type, children, variables, intentStepIDs = [] }, { rootDiagramID }) => ({
    id: _id,
    name,
    type: type ?? (rootDiagramID === _id ? BaseModels.DiagramType.TOPIC : BaseModels.DiagramType.COMPONENT),
    variables,
    subDiagrams: children,
    intentStepIDs,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default diagramAdapter;

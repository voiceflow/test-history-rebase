import { DBDiagram, Diagram } from '@/models';

import { createAdapter } from './utils';

const diagramAdapter = createAdapter<DBDiagram, Diagram>(
  ({ id, name, sub_diagrams }) => ({
    id,
    name,
    subDiagrams: (sub_diagrams && JSON.parse(sub_diagrams)) || [],
  }),
  ({ id, name, subDiagrams }) => ({
    id,
    name,
    sub_diagrams: JSON.stringify(subDiagrams),
  })
);

export default diagramAdapter;

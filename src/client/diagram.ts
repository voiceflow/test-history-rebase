import { PlatformType } from '@/constants';
import { DBDiagram } from '@/models';

import creatorAdapter from './adapters/creator';
import diagramAdapter from './adapters/diagram';
import fetch, { NetworkError, StatusCode } from './fetch';

const DIAGRAM_PATH = 'diagram';
const VARIABLES_PATH = 'variables';

export type CreateDiagramPayload = {
  id: string;
  data: string;
  title: string;
  variables: string[];
  skill: string;
};

export type UpdateDiagramPayload = Omit<CreateDiagramPayload, 'id'> & {
  sub_diagrams: string;
  lastTimestamp?: number;
};

const diagramClient = {
  getData: (diagramID: string, platform: PlatformType, isBlockRedesignEnabled: boolean) =>
    fetch
      .get<{ diagram: { data: string; variables?: string[] }; timestamp: number }>(`${DIAGRAM_PATH}/${diagramID}`)
      .then(({ diagram, timestamp }) => ({
        data: creatorAdapter.fromDB(JSON.parse(diagram.data), platform, isBlockRedesignEnabled),
        variables: diagram.variables || [],
        timestamp,
      })),

  get: (diagramID: string) => fetch.get<{ diagram: DBDiagram }>(`${DIAGRAM_PATH}/${diagramID}`).then(({ diagram }) => diagramAdapter.fromDB(diagram)),

  create: (diagram: CreateDiagramPayload) => fetch.post(`${DIAGRAM_PATH}?new=1`, diagram),

  copy: (diagramID: string, name: string) => fetch.get<string>(`${DIAGRAM_PATH}/copy/${diagramID}?name=${encodeURI(name)}`),

  delete: (diagramID: string) =>
    fetch.delete(`${DIAGRAM_PATH}/${diagramID}`).catch((err) => {
      if (err instanceof NetworkError && err.statusCode === StatusCode.FORBIDDEN) {
        throw new NetworkError(err.statusCode, 'Flow has active users and cannot be deleted at the moment');
      } else {
        throw new NetworkError(err.statusCode || StatusCode.SERVER_ERROR, 'Error Deleting Flow');
      }
    }),

  rename: (diagramID: string, name: string) => fetch.post(`${DIAGRAM_PATH}/${diagramID}/name`, { name }),

  update: (diagram: UpdateDiagramPayload) => fetch.post(`${DIAGRAM_PATH}`, diagram),

  findVariables: (diagramID: string) => fetch.get<string[]>(`${DIAGRAM_PATH}/${diagramID}/${VARIABLES_PATH}`),

  updateVariables: (diagramID: string, variables: string[]) => fetch.patch(`${DIAGRAM_PATH}/${diagramID}/${VARIABLES_PATH}`, { variables }),
};

export default diagramClient;

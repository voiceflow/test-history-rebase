import creatorAdapter from './adapters/creator';
import diagramAdapter from './adapters/diagram';
import fetch, { NetworkError, StatusCode } from './fetch';

const DIAGRAM_PATH = 'diagram';
const VARIABLES_PATH = 'variables';

const diagramClient = {
  getData: (diagramID, platform) =>
    fetch(`${DIAGRAM_PATH}/${diagramID}`).then(({ diagram, timestamp = [] }) => ({
      data: creatorAdapter.fromDB(JSON.parse(diagram.data), platform),
      variables: diagram.variables || [],
      timestamp,
    })),

  get: (diagramID) => fetch(`${DIAGRAM_PATH}/${diagramID}`).then(({ diagram }) => diagramAdapter.fromDB(diagram)),

  create: (diagram) => fetch.post(`${DIAGRAM_PATH}?new=1`, diagram),

  copy: (diagramID, newFlowName) => fetch(`${DIAGRAM_PATH}/copy/${diagramID}?name=${encodeURI(newFlowName)}`),

  delete: (diagramID) =>
    fetch.delete(`${DIAGRAM_PATH}/${diagramID}`).catch((err) => {
      if (err instanceof NetworkError && err.statusCode === StatusCode.FORBIDDEN) {
        throw new NetworkError(err.statusCode, 'Flow has active users and cannot be deleted at the moment');
      } else {
        throw new NetworkError(err.statusCode || StatusCode.SERVER_ERROR, 'Error Deleting Flow');
      }
    }),

  rename: (diagramID, name) => fetch.post(`${DIAGRAM_PATH}/${diagramID}/name`, { name }),

  update: (diagram) => fetch.post(`${DIAGRAM_PATH}`, diagram),

  findVariables: (diagramID) => fetch(`${DIAGRAM_PATH}/${diagramID}/${VARIABLES_PATH}`),

  updateVariables: (diagramID, variables) => fetch.patch(`${DIAGRAM_PATH}/${diagramID}/${VARIABLES_PATH}`, { variables }),
};

export default diagramClient;

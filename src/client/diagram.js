import creatorAdapter from './adapters/creator';
import diagramAdapter from './adapters/diagram';
import fetch from './fetch';

const DIAGRAM_PATH = 'diagram';
const VARIABLES_PATH = 'variables';

const diagramClient = {
  getData: (diagramID, platform) => fetch(`${DIAGRAM_PATH}/${diagramID}`).then((body) => creatorAdapter.fromDB(JSON.parse(body.data), platform)),

  get: (diagramID) => fetch(`${DIAGRAM_PATH}/${diagramID}`).then(diagramAdapter.fromDB),

  create: (diagram) => fetch.post(`${DIAGRAM_PATH}?new=1`, diagram),

  copy: (diagramID, newFlowName) => fetch(`${DIAGRAM_PATH}/copy/${diagramID}?name=${encodeURI(newFlowName)}`),

  delete: (diagramID) => fetch.delete(`${DIAGRAM_PATH}/${diagramID}`),

  rename: (diagramID, name) => fetch.post(`${DIAGRAM_PATH}/${diagramID}/name`, { name }),

  update: (diagram) => fetch.post(`${DIAGRAM_PATH}`, diagram),

  findVariables: (diagramID) => fetch(`${DIAGRAM_PATH}/${diagramID}/${VARIABLES_PATH}`),

  updateVariables: (diagramID, variables) => fetch.patch(`${DIAGRAM_PATH}/${diagramID}/${VARIABLES_PATH}`, { variables }),
};

export default diagramClient;

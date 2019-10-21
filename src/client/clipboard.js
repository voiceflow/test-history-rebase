import diagramAdapter from './adapters/diagram';
import displayAdapter from './adapters/display';
import productAdapter from './adapters/product';
import fetch from './fetch';

const clipboardClient = {
  copy: (skillID, nodes) => fetch.post(`skill/${skillID}/clipboard/copy`, nodes),

  paste: (skillID, { nodes, products, displays, diagrams }) =>
    fetch.post(`skill/${skillID}/clipboard/paste`, {
      nodes,
      products: productAdapter.mapToDB(products),
      displays: displayAdapter.mapToDB(displays).map(({ id, ...display }) => ({ ...display, display_id: id })),
      diagrams: diagramAdapter.mapToDB(diagrams),
    }),
};

export default clipboardClient;

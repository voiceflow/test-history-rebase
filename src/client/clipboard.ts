import { DBNode, Diagram, Display, Product } from '@/models';

import diagramAdapter from './adapters/diagram';
import displayAdapter from './adapters/display';
import productAdapter from './adapters/product';
import fetch from './fetch';

const clipboardClient = {
  copy: (skillID: string, nodes: DBNode[]) =>
    fetch.post<{ intents: string[]; displays: string[]; products: string[]; diagrams: string[] }>(`skill/${skillID}/clipboard/copy`, nodes),

  paste: (
    skillID: string,
    { nodes, products, displays, diagrams }: { nodes: DBNode[]; products: Product[]; displays: Display[]; diagrams: Diagram[] }
  ) =>
    fetch.post<{
      newNodes: DBNode[];
      newDiagrams: Record<string, string>;
    }>(`skill/${skillID}/clipboard/paste`, {
      nodes,
      products: productAdapter.mapToDB(products),
      displays: displayAdapter.mapToDB(displays).map(({ id, ...display }) => ({ ...display, display_id: id })),
      diagrams: diagramAdapter.mapToDB(diagrams),
    }),
};

export default clipboardClient;

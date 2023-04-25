import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import { BlockType } from '@/constants';
import * as CanvasTemplate from '@/ducks/canvasTemplate';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProductV2 from '@/ducks/productV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as SlotV2 from '@/ducks/slotV2';
import * as TrackingEvents from '@/ducks/tracking/events';
import * as VersionV2 from '@/ducks/versionV2';
import { Coords } from '@/utils/geometry';

import { EngineConsumer, getCopiedNodeDataIDs } from './utils';

interface TemplateCanvasContext {
  versionID: string;
  nodes: Realtime.Node[];
  data: Record<string, Realtime.NodeData<unknown>>;
  ports: Realtime.Port[];
  links: Realtime.Link[];
  slots: Realtime.Slot[];
  intents: Platform.Base.Models.Intent.Model[];
  products: Realtime.Product[];
  diagrams: Realtime.Diagram[];
  platform: Platform.Constants.PlatformType;
  blockColor?: string | null;
}

class CanvasTemplateEngine extends EngineConsumer {
  log = this.engine.log.child('canvas template');

  selectNestedSteps = (nodeIDs: string[]) => {
    const getNodeByID = (id: string) => this.engine.getNodeByID(id) || this.select(CanvasTemplate.nodeByIDSelector, { id });

    return nodeIDs
      .flatMap((nodeID) => {
        const node = getNodeByID(nodeID);
        const isCombined = node?.type === BlockType.COMBINED || node?.type === BlockType.ACTIONS;

        return isCombined ? node.combinedNodes.map((stepID) => getNodeByID(stepID)?.type) : node?.type;
      })
      .filter(Utils.array.isNotNullish);
  };

  trackTemplateUsed = ({ templateID, nodeIDs, droppedInto }: { templateID: string; nodeIDs: string[]; droppedInto: 'canvas' | 'block' }) =>
    this.dispatch(
      TrackingEvents.trackBlockTemplateUsed({
        templateID,
        nestedSteps: this.selectNestedSteps(nodeIDs),
        droppedInto,
      })
    );

  async createTemplate(name: string, color: string | null, allNodeIDs: string[], coords: Coords): Promise<Realtime.CanvasTemplate | null> {
    try {
      const nodeIDs = [...allNodeIDs, ...this.engine.node.getAllLinkedOutActionsNodeIDs(allNodeIDs)].filter((id) => id !== Realtime.START_NODE_ID);
      const templateData = this.getCreatorContext(nodeIDs);
      const templateDiagramID = this.select(VersionV2.active.templateDiagramIDSelector) ?? (await this.dispatch(Diagram.createTemplateDiagram()));

      const { nodesWithData } = await this.cloneCanvasTemplateContext(templateData, coords, templateDiagramID);

      const newNodeIDs = nodesWithData
        .filter(({ data }) => Realtime.Utils.typeGuards.isMarkupTemplateBlockType(data.type))
        .map(({ data }) => data.nodeID);

      const createdTemplate = await this.dispatch(
        CanvasTemplate.createCanvasTemplate({
          name,
          color,
          nodeIDs: newNodeIDs,
        })
      );

      this.dispatch(
        TrackingEvents.trackBlockTemplateCreated({
          templateID: createdTemplate.id,
          nestedSteps: this.selectNestedSteps(nodeIDs),
        })
      );

      this.log.info(this.log.success('create template'), this.log.value(nodesWithData.length));

      return createdTemplate;
    } catch (err) {
      this.log.warn('error while creating template', err);
      return null;
    }
  }

  getCreatorContext(nodeIDs: string[]) {
    return this.getDiagramContext(nodeIDs, CreatorV2);
  }

  getCanvasTemplateContext(canvasTemplate: Realtime.CanvasTemplate) {
    const diagramContext = this.getDiagramContext(canvasTemplate.nodeIDs, CanvasTemplate);

    return {
      ...diagramContext,
      blockColor: canvasTemplate?.color,
    };
  }

  getDiagramContext(nodeIDs: string[], DiagramDataDuck: typeof CanvasTemplate | typeof CreatorV2): TemplateCanvasContext {
    const platform = this.select(ProjectV2.active.platformSelector);

    // cloning data to modify it later
    const { ...data } = this.select(DiagramDataDuck.nodeDataMapSelector);

    const versionID = this.select(Session.activeVersionIDSelector);

    Errors.assertVersionID(versionID);

    const allNodes = this.select(DiagramDataDuck.nodesByIDsSelector, { ids: nodeIDs });

    const soloNodes = allNodes.filter((node) => !node.parentNode);
    const nestedNodes = soloNodes.flatMap(({ combinedNodes }) => this.select(DiagramDataDuck.nodesByIDsSelector, { ids: combinedNodes }));
    const orphanedNodes: Realtime.Node[] = [];

    const extraLinks: Realtime.Link[] = [];
    const extraPorts: Realtime.Port[] = [];

    allNodes
      .filter((node) => node.parentNode && !nodeIDs.includes(node.parentNode))
      .forEach(({ id, parentNode: parentNodeID, ...nestedNode }) => {
        const parentNode = this.engine.getNodeByID(parentNodeID)!;

        const nodeOverrides = { parentNode: null, x: parentNode.x, y: parentNode.y, combinedNodes: [id] };

        const entities = this.engine.diagram.getParentEntities(parentNodeID!, true, nodeOverrides);

        entities.nodesWithData.forEach(({ data: nodeData }) => {
          data[nodeData.nodeID] = nodeData;
        });

        soloNodes.push(...entities.nodesWithData.map(({ node }) => node));
        extraLinks.push(...entities.links);
        extraPorts.push(...entities.ports);

        const newParentNodeID = entities.nodesWithData[0].node.id;
        orphanedNodes.push({ id, ...nestedNode, parentNode: newParentNodeID });
      });

    const copiedNodes = [
      ...soloNodes.map((node) => ({
        ...node,
        blockColor: this.select(DiagramDataDuck.blockColorSelector, { id: node.id }),
      })),
      ...orphanedNodes,
      ...nestedNodes,
    ];
    const copiedNodeIDMap = copiedNodes.reduce<Record<string, boolean>>((acc, node) => Object.assign(acc, { [node.id]: true }), {});

    const ports = this.select(DiagramDataDuck.allPortsByIDsSelector, {
      ids: copiedNodes.flatMap((node) => Realtime.Utils.port.flattenAllPorts(node.ports)),
    }).filter(Boolean);

    const links = copiedNodes.reduce<Realtime.Link[]>((acc, node) => {
      const nodeLinks = this.select(DiagramDataDuck.linksByNodeIDSelector, { id: node.id }).filter(
        (link) => !acc.includes(link) && copiedNodeIDMap[link.source.nodeID] && copiedNodeIDMap[link.target.nodeID]
      );

      acc.push(...nodeLinks);

      return acc;
    }, []);

    const { intents: intentIDs, products: productIDs, diagrams: diagramIDs } = getCopiedNodeDataIDs(data, copiedNodes);

    const products = this.select(ProductV2.productsByIDsSelector, { ids: productIDs });
    const diagrams = this.select(DiagramV2.diagramsByIDsSelector, { ids: diagramIDs });
    const intents = this.select(IntentV2.intentsByIDsSelector, { ids: intentIDs });
    const slotIDs = this.select(IntentV2.allSlotsIDsByIntentIDsSelector, { ids: intentIDs });
    const slots = this.select(SlotV2.slotsByIDsSelector, { ids: slotIDs });

    return {
      versionID,
      data,
      nodes: copiedNodes,
      ports: [...ports, ...extraPorts],
      links: [...links, ...extraLinks],
      products,
      diagrams,
      intents,
      slots,
      platform,
    };
  }

  async cloneCanvasTemplateContext(
    templateData: TemplateCanvasContext,
    coords: Coords,
    diagramID: string
  ): Promise<{
    nodesWithData: Realtime.NodeWithData[];
    ports: Realtime.Port[];
    links: Realtime.Link[];
  }> {
    const nodesWithData = templateData.nodes.map((node) => ({
      data: { ...templateData.data[node.id], blockColor: templateData.blockColor || node.blockColor },
      node,
    }));
    const { ports, links } = templateData;

    return this.engine.diagram.cloneEntities({ nodesWithData, ports, links }, coords, { diagramID });
  }

  private handleNewTemplateDrop(nodesWithData: Realtime.NodeWithData[]) {
    const nonMarkupNodes = nodesWithData.filter(({ node }) => !Realtime.Utils.typeGuards.isMarkupBlockType(node.type));

    if (!nonMarkupNodes[0]?.node.combinedNodes[0]) return;

    this.engine.setActive(nonMarkupNodes[0].node.combinedNodes[0]);
  }

  async dropTemplate(templateID: string, coords: Coords): Promise<Realtime.NodeWithData[]> {
    const diagramID = this.select(CreatorV2.activeDiagramIDSelector)!;
    const canvasTemplate = CanvasTemplate.canvasTemplatesByIDSelector(this.engine.store.getState(), { id: templateID });

    Errors.assertDiagramID(diagramID);
    Errors.assertCanvasTemplateID(canvasTemplate?.id);

    if (!canvasTemplate) return [];

    try {
      this.log.debug(this.log.pending('dropping template to canvas'));

      const templateData = this.getCanvasTemplateContext(canvasTemplate);

      const { nodesWithData } = await this.cloneCanvasTemplateContext(templateData, coords, diagramID);

      this.handleNewTemplateDrop(nodesWithData);

      this.trackTemplateUsed({ templateID, nodeIDs: nodesWithData.map(({ node }) => node.id), droppedInto: 'canvas' });

      this.log.info(this.log.success('dropped template to canvas'), this.log.value(nodesWithData.length));
      return nodesWithData;
    } catch (err) {
      this.log.warn('error while dropping template', err);
    }
    return [];
  }
}

export default CanvasTemplateEngine;

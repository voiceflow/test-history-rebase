/* eslint-disable no-param-reassign */
import { BaseModels, BaseNode, BaseUtils } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type { Draft } from 'immer';

import type { Transform } from './types';

const goToNodeFactory = (intent: string | null = null, diagramID: string | null = null): BaseNode.GoTo.Step => ({
  type: BaseNode.NodeType.GOTO,
  data: {
    portsV2: { byKey: {}, dynamic: [], builtIn: {} },
    intent,
    diagramID,
  },
  nodeID: Utils.id.objectID(),
});

const urlFactory = (url: string, target: string | null = null): BaseNode.Url.Step => ({
  type: BaseNode.NodeType.URL,
  data: {
    url,
    portsV2: {
      byKey: {},
      dynamic: [],
      builtIn: { [BaseModels.PortType.NEXT]: { id: Utils.id.objectID(), type: BaseModels.PortType.NEXT, target } },
    },
  },
  nodeID: Utils.id.objectID(),
});

const actionsNodeFactory = (stepIDs: string[] = []): BaseModels.BaseActions => ({
  type: BaseModels.BaseNodeType.ACTIONS,
  data: { steps: stepIDs },
  nodeID: Utils.id.objectID(),
});

const migrateButtons = (
  nodes: Draft<Record<string, BaseModels.BaseDiagramNode>>,
  node: BaseNode.Buttons.Step
): void => {
  node.data.buttons.forEach((button, index) => {
    const { url, intent, actions, diagramID } = button;

    const hasURL = actions.includes(BaseNode.Buttons.ButtonAction.URL) && !!url;
    const hasIntent = actions.includes(BaseNode.Buttons.ButtonAction.INTENT) && !!intent;

    button.actions = [BaseNode.Buttons.ButtonAction.PATH];

    if (!hasURL && !hasIntent) return;

    if (!node.data.portsV2!.dynamic[index]) {
      node.data.portsV2!.dynamic[index] = { id: Utils.id.objectID(), type: '', target: null };
    }

    const { target: originalTarget } = node.data.portsV2!.dynamic[index];
    const actionsNode = actionsNodeFactory();

    node.data.portsV2!.dynamic[index].target = actionsNode.nodeID;
    nodes[actionsNode.nodeID] = actionsNode;

    if (hasURL) {
      const urlNode = urlFactory(url, hasIntent ? null : originalTarget);

      delete button.url;

      actionsNode.data.steps.push(urlNode.nodeID);
      nodes[urlNode.nodeID] = urlNode;
    }

    if (hasIntent) {
      const goToNode = goToNodeFactory(intent, diagramID);

      delete button.intent;
      delete button.diagramID;

      actionsNode.data.steps.push(goToNode.nodeID);
      nodes[goToNode.nodeID] = goToNode;
    }
  });
};

const migrateInteraction = (
  nodes: Draft<Record<string, BaseModels.BaseDiagramNode>>,
  node: BaseNode.Interaction.Step
): void => {
  node.data.choices.forEach((choice, index) => {
    const { goTo, action } = choice;

    delete choice.goTo;
    delete choice.action;

    if (action !== BaseNode.Interaction.ChoiceAction.GO_TO) return;

    const goToNode = goToNodeFactory(goTo?.intentID, goTo?.diagramID);
    const actionsNode = actionsNodeFactory([goToNode.nodeID]);

    if (!node.data.portsV2!.dynamic[index]) {
      node.data.portsV2!.dynamic[index] = { id: Utils.id.objectID(), type: '', target: null };
    }

    node.data.portsV2!.dynamic[index].target = actionsNode.nodeID;
    nodes[goToNode.nodeID] = goToNode;
    nodes[actionsNode.nodeID] = actionsNode;
  });
};

/**
 * this migration converts the "go to intent" and "url" data (buttons/choices) into a new "go to intent"/"url" actions
 * via creating an "actions", "goTo", and "url" nodes and removing the "go to intent"/"url" related node data
 */
const migrateToV2_5: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    Object.values(dbDiagram.nodes).forEach((dbNode) => {
      if (BaseUtils.step.isButtons(dbNode)) migrateButtons(dbDiagram.nodes, dbNode);
      if (BaseUtils.step.isInteraction(dbNode)) migrateInteraction(dbDiagram.nodes, dbNode);
    });
  });
};

export default migrateToV2_5;

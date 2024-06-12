/* eslint-disable no-param-reassign */
import { typeGuards } from '@realtime-sdk/utils';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { FolderScope, Workflow } from '@voiceflow/dtos';

import { Transform } from './types';

/**
 * migrates domains and topics to workflows
 */

const migrateToV8_00: Transform = ({ cms, version, diagrams }, { project, creatorID }) => {
  const createdAt = new Date().toJSON();
  const diagramMap = Utils.array.createMap(diagrams, (diagram) => diagram.diagramID);
  const { rootDiagramID } = version;
  const { id: assistantID, versionID: environmentID } = project;
  const commandNodes: BaseNode.Command.Step[] = [];
  const workflowsDiagramIDMap: Record<string, Workflow> = {};
  const domainIDRootDiagramIDMap: Record<string, string> = {};
  const domainRootDiagramIDStartNextIDMap: Record<string, string | null> = {};
  const domainRootDiagramIDStartNodeIDMap: Record<string, string> = {};

  // creating workflows for topics
  diagrams.forEach(({ type, name, diagramID }) => {
    if (type !== BaseModels.Diagram.DiagramType.TOPIC) return;

    workflowsDiagramIDMap[diagramID] = {
      id: Utils.id.objectID(),
      name: name === 'ROOT' ? 'Home' : name || 'Untitled',
      status: null,
      isStart: rootDiagramID === diagramID,
      folderID: null,
      updatedAt: createdAt,
      createdAt,
      diagramID,
      assigneeID: null,
      assistantID,
      description: null,
      createdByID: creatorID,
      updatedByID: creatorID,
      environmentID,
    };
  });

  version.domains?.forEach(({ id, name, topicIDs, rootDiagramID }, _index, domains) => {
    const rootDomainDiagram = diagramMap[rootDiagramID];

    domainIDRootDiagramIDMap[id] = rootDiagramID;

    const startNode = Object.values(rootDomainDiagram?.nodes ?? {}).find(typeGuards.isStartDBNode);

    if (startNode) {
      domainRootDiagramIDStartNodeIDMap[rootDiagramID] = startNode.nodeID;
      domainRootDiagramIDStartNextIDMap[rootDiagramID] =
        startNode.data.portsV2?.builtIn[BaseModels.PortType.NEXT]?.target ?? null;
    }

    // don't create folder for single domain projects
    if (domains.length === 1) return;

    const folderID = Utils.id.objectID();

    // create folder for domain
    cms.folders.push({
      id: folderID,
      name,
      scope: FolderScope.WORKFLOW,
      parentID: null,
      createdAt,
      updatedAt: createdAt,
      assistantID,
      environmentID,
    });

    // nest workflows under domain folder
    topicIDs.forEach((topicID) => {
      const workflow = workflowsDiagramIDMap[topicID];

      if (!workflow) return;

      workflow.folderID = folderID;
    });
  });

  const domainRootDiagramIDs = new Set(Object.values(domainIDRootDiagramIDMap));

  diagrams.forEach(({ type, nodes, diagramID, menuItems }) => {
    const isTopic = type === BaseModels.Diagram.DiagramType.TOPIC;

    if (isTopic) {
      const subTopicDiagramIDs =
        menuItems
          ?.filter((menuItem) => menuItem.type === BaseModels.Diagram.MenuItemType.DIAGRAM)
          .map((menuItem) => menuItem.sourceID) ?? [];

      const workflow = workflowsDiagramIDMap[diagramID];

      // creating folders for topics with subtopics
      if (subTopicDiagramIDs.length) {
        const folderID = Utils.id.objectID();

        cms.folders.push({
          id: folderID,
          name: workflow.name,
          scope: FolderScope.WORKFLOW,
          parentID: workflow.folderID,
          createdAt,
          updatedAt: createdAt,
          assistantID,
          environmentID,
        });

        workflow.folderID = folderID;

        subTopicDiagramIDs.forEach((subTopicDiagramID) => {
          const subTopicWorkflow = workflowsDiagramIDMap[subTopicDiagramID];

          if (!subTopicWorkflow) return;

          subTopicWorkflow.folderID = folderID;
        });
      }
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    Object.values(nodes).forEach((node) => {
      // update goto node that points to domain start node to point to next node in domain root diagram
      if (typeGuards.isGoToNodeDBNode(node)) {
        const { nodeID: goToNodeID, diagramID: goToDiagramID } = node.data;

        const isGoToRootDomainDiagram = goToDiagramID ? domainRootDiagramIDs.has(goToDiagramID) : false;

        if (
          isGoToRootDomainDiagram &&
          goToNodeID &&
          goToDiagramID &&
          goToDiagramID !== rootDiagramID &&
          domainRootDiagramIDStartNodeIDMap[goToDiagramID] === goToNodeID
        ) {
          node.data.nodeID = domainRootDiagramIDStartNextIDMap[goToDiagramID] ?? null;
        }
      }

      // replace goto domain node with goto node
      if (typeGuards.isGoToDomainDBNode(node)) {
        const { domainID: goToDomainID } = node.data;

        const nodeDiagramID = goToDomainID ? domainIDRootDiagramIDMap[goToDomainID] ?? null : null;
        const nodeDiagramIsRoot = nodeDiagramID === rootDiagramID;
        const nodeIDMap = nodeDiagramIsRoot ? domainRootDiagramIDStartNodeIDMap : domainRootDiagramIDStartNextIDMap;

        const goToNode: BaseNode.GoToNode.Step = {
          ...Utils.object.pick(node, ['nodeID', 'coords']),
          type: BaseNode.NodeType.GOTO_NODE,
          data: {
            nodeID: nodeDiagramID ? nodeIDMap[nodeDiagramID] ?? null : null,
            portsV2: {},
            diagramID: nodeDiagramID,
          },
        };

        Object.assign(node, goToNode);
      }
    });

    if (isTopic && diagramID !== rootDiagramID) {
      const startNodeID = domainRootDiagramIDStartNodeIDMap[diagramID];
      const startNode = nodes[startNodeID];

      if (startNode && typeGuards.isStartDBNode(startNode)) {
        // remove start node from non root topics
        delete nodes[startNodeID];

        // delete command nodes from non root topics
        startNode.data.steps?.forEach((stepID) => {
          const stepNode = nodes[stepID];

          if (stepNode && typeGuards.isCommandDBNode(stepNode)) {
            commandNodes.push({ ...stepNode, nodeID: Utils.id.objectID() });
          }

          delete nodes[stepID];
        });
      }
    }
  });

  const rootDiagram = diagramMap[rootDiagramID];
  const rootDiagramStartNode = Object.values(rootDiagram?.nodes ?? {}).find(typeGuards.isStartDBNode);

  // move command nodes to root diagram
  if (rootDiagramStartNode) {
    rootDiagramStartNode.data.steps?.push(...commandNodes.map((node) => node.nodeID));

    Object.assign(
      rootDiagram.nodes,
      Utils.array.createMap(commandNodes, (node) => node.nodeID)
    );
  }

  cms.workflows.push(...Object.values(workflowsDiagramIDMap));
};

export default migrateToV8_00;

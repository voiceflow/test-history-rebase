/* eslint-disable dot-notation */
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { ObjectId } from 'bson';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import DiagramModel from '@/legacy/models/diagram/index';

describe('Diagram model unit tests', () => {
  beforeEach(() => {
    // skip model initialization
    vi.spyOn(DiagramModel.prototype, 'setup');
  });

  it('findManyByVersionID', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const result = [
      { _id: 'diagram-id', name: 'diagram name' },
      { _id: 'diagram-id2', name: 'diagram name 2' },
    ];
    const stubFindMany = vi.fn().mockResolvedValue(result);
    model.findMany = stubFindMany;

    const versionID = '5f11ac822ab2ce1957cb0d24';
    expect(await model.findManyByVersionID(versionID, ['name'])).to.eql(result);

    expect(stubFindMany.mock.calls).to.eql([[{ versionID: new ObjectId(versionID) }, ['name']]]);
  });

  it('patchManyNodes', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const data = { coords: [10, 100] };
    const data2 = { field: { a: 20 } };
    const atomicUpdateOne = vi.fn().mockResolvedValue(data);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const nodeID2 = 'node-id-2';

    expect(
      await model.patchManyNodes(versionID, diagramID, [
        { nodeID, patch: data },
        { nodeID: nodeID2, patch: data2 },
      ])
    ).to.eql(data);

    expect(atomicUpdateOne.mock.calls).to.eql([
      [
        { versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) },
        [
          {
            arrayFilters: [],
            operation: '$set',
            query: { 'nodes.node-id.coords': data.coords, 'nodes.node-id-2.field': data2.field },
          },
        ],
      ],
    ]);
  });

  it('addStep', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const parentNodeID = 'block-id';
    const step = { nodeID: 'node-id', type: 'type', data: { ports: [{ id: 'port-id' }] as any, steps: [] } };

    await expect(
      model.addStep(versionID, diagramID, {
        parentNodeID,
        step,
        nodePortRemaps: [],
        removeNodes: [],
        index: null,
        isActions: false,
      })
    ).resolves.toEqual(step);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { 'nodes.node-id': step },
        operation: '$set',
        arrayFilters: [],
      },
      {
        query: { 'nodes.block-id.data.steps': { $each: ['node-id'] } },
        operation: '$push',
        arrayFilters: [],
      },
    ]);
  });

  it('addStep - intent step', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const parentNodeID = 'block-id';
    const step = {
      nodeID: 'node-id',
      type: BaseNode.NodeType.INTENT,
      data: { ports: [{ id: 'port-id' }] as any, steps: [] },
    };

    await expect(
      model.addStep(versionID, diagramID, {
        parentNodeID,
        step,
        nodePortRemaps: [],
        removeNodes: [],
        index: null,
        isActions: false,
      })
    ).resolves.toEqual(step);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { menuItems: { $each: [{ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: 'node-id' }] } },
        operation: '$push',
        arrayFilters: [],
      },
      {
        query: { 'nodes.node-id': step },
        operation: '$set',
        arrayFilters: [],
      },
      {
        query: { 'nodes.block-id.data.steps': { $each: ['node-id'] } },
        operation: '$push',
        arrayFilters: [],
      },
    ]);
  });

  it('addStep - with index', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const parentNodeID = 'block-id';
    const step = { nodeID: 'node-id', type: 'type', data: { ports: [{ id: 'port-id' }] as any, steps: [] } };
    const index = 5;

    await expect(
      model.addStep(versionID, diagramID, {
        parentNodeID,
        step,
        index,
        removeNodes: [],
        nodePortRemaps: [],
        isActions: false,
      })
    ).resolves.toEqual(step);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { 'nodes.node-id': step },
        operation: '$set',
        arrayFilters: [],
      },
      {
        query: { 'nodes.block-id.data.steps': { $each: ['node-id'], $position: index } },
        operation: '$push',
        arrayFilters: [],
      },
    ]);
  });

  it('addManyNodes - with intent steps', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const node1 = { nodeID: 'node-1', type: 'type', data: { foo: 'bar' } };
    const node2 = { nodeID: 'node-2', type: BaseNode.NodeType.INTENT, data: { fizz: 'buzz' } };
    const nodes = [node1, node2];

    await expect(model.addManyNodes(versionID, diagramID, { nodes })).resolves.toEqual(nodes);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { menuItems: { $each: [{ type: BaseModels.Diagram.MenuItemType.NODE, sourceID: 'node-2' }] } },
        operation: '$push',
        arrayFilters: [],
      },
      {
        query: { 'nodes.node-1': node1, 'nodes.node-2': node2 },
        operation: '$set',
        arrayFilters: [],
      },
    ]);
  });

  it('addManyNodes - no intent steps', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const node1 = { nodeID: 'node-1', type: 'type', data: { foo: 'bar' } };
    const node2 = { nodeID: 'node-2', type: 'type', data: { fizz: 'buzz' } };
    const nodes = [node1, node2];

    await expect(model.addManyNodes(versionID, diagramID, { nodes })).resolves.toEqual(nodes);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { 'nodes.node-1': node1, 'nodes.node-2': node2 },
        operation: '$set',
        arrayFilters: [],
      },
    ]);
  });

  it('isolateSteps', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const sourceParentNodeID = 'source-block-id';
    const parentNode: BaseModels.BaseBlock = {
      nodeID: 'block-id',
      type: BaseModels.BaseNodeType.BLOCK,
      data: { name: 'block', color: '', steps: [] },
      coords: [10, 20] as [number, number],
    };
    const stepIDs = ['step-id'];

    await expect(
      model.isolateSteps({ versionID, diagramID, sourceParentNodeID, parentNode, stepIDs })
    ).resolves.toEqual(stepIDs);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { 'nodes.block-id': parentNode },
        operation: '$set',
        arrayFilters: [],
      },
      {
        query: { 'nodes.source-block-id.data.steps': { $in: stepIDs } },
        operation: '$pull',
        arrayFilters: [],
      },
    ]);
  });

  it('reorderSteps', async () => {
    const model = new DiagramModel(null as any, {} as any);

    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);

    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const parentNodeID = 'block-id';
    const stepID = 'step-id';
    const index = 5;

    await expect(
      model.reorderSteps({ versionID, diagramID, parentNodeID, stepID, index, nodePortRemaps: [], removeNodes: [] })
    ).resolves.toEqual(stepID);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { 'nodes.block-id.data.steps': stepID },
        operation: '$pull',
        arrayFilters: [],
      },
    ]);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { 'nodes.block-id.data.steps': { $each: [stepID], $position: index } },
        operation: '$push',
        arrayFilters: [],
      },
    ]);
  });

  it('transplantSteps', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const sourceParentNodeID = 'source-block-id';
    const targetParentNodeID = 'target-block-id';
    const stepIDs = ['step-id'];
    const index = 5;

    await expect(
      model.transplantSteps({
        versionID,
        diagramID,
        sourceParentNodeID,
        targetParentNodeID,
        stepIDs,
        index,
        removeNodes: [],
        removeSource: false,
        nodePortRemaps: [],
      })
    ).resolves.toEqual(stepIDs);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { 'nodes.source-block-id.data.steps': { $in: stepIDs } },
        operation: '$pull',
        arrayFilters: [],
      },
      {
        query: { 'nodes.target-block-id.data.steps': { $each: stepIDs, $position: index } },
        operation: '$push',
        arrayFilters: [],
      },
    ]);
  });

  it('updateNodeCoords', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchManyNodes = vi.fn().mockResolvedValue(undefined);
    model.patchManyNodes = patchManyNodes;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodes = { foo: [10, 20] as [number, number], bar: [300, -1] as [number, number] };

    await expect(model.updateNodeCoords(versionID, diagramID, nodes)).resolves.toEqual(nodes);

    expect(patchManyNodes).toBeCalledWith(versionID, diagramID, [
      { nodeID: 'foo', patch: { coords: [10, 20] } },
      { nodeID: 'bar', patch: { coords: [300, -1] } },
    ]);
  });

  it('removeManyNodes', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const stepID = 'step-id';
    const nodes = [{ parentNodeID: 'block-id', stepID }, { parentNodeID: 'markup-id' }];

    await expect(model.removeManyNodes(versionID, diagramID, { nodes })).resolves.toEqual(nodes);

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      {
        query: { menuItems: { type: BaseModels.Diagram.MenuItemType.NODE, sourceID: { $in: [stepID] } } },
        operation: '$pull',
        arrayFilters: [],
      },
      {
        query: { 'nodes.step-id': 1, 'nodes.markup-id': 1 },
        operation: '$unset',
        arrayFilters: [],
      },
      {
        query: { 'nodes.block-id.data.steps': stepID },
        operation: '$pull',
        arrayFilters: [],
      },
    ]);
  });

  it('addBuiltInLink', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchNodeData = vi.fn().mockResolvedValue(undefined);
    model.patchNodeData = patchNodeData;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const type = BaseModels.PortType.NO_MATCH;
    const target = 'target-id';

    await model.addBuiltInLink(versionID, diagramID, nodeID, { type, target });

    expect(patchNodeData).toBeCalledWith(versionID, diagramID, nodeID, [
      { path: `portsV2.builtIn.${type}.target`, value: target },
      { path: `portsV2.builtIn.${type}.data`, value: {} },
    ]);
  });

  it('addDynamicLink', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchNodeData = vi.fn().mockResolvedValue(undefined);
    model.patchNodeData = patchNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const versionID = '650857e65c2684007cec75a6';
    const nodeID = 'node-id';
    const portID = 'port-id';
    const target = 'target-id';

    await model.addDynamicLink(versionID, diagramID, nodeID, { portID, target });

    expect(patchNodeData).toBeCalledWith(versionID, diagramID, nodeID, [
      { path: ['portsV2.dynamic', { id: portID }, 'target'], value: target },
      { path: ['portsV2.dynamic', { id: portID }, 'data'], value: {} },
    ]);
  });

  it('removeManyLinks', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchManyNodesData = vi.fn().mockResolvedValue(undefined);
    model.patchManyNodesData = patchManyNodesData;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const port1 = BaseModels.PortType.NO_MATCH;
    const port2 = 'port-2';
    const links = [
      { nodeID: 'node-1', type: port1 },
      { nodeID: 'node-2', portID: port2 },
    ];

    await expect(model.removeManyLinks(versionID, diagramID, links)).resolves.toEqual(links);

    expect(patchManyNodesData).toBeCalledWith(versionID, diagramID, [
      {
        nodeID: 'node-1',
        patches: [{ path: `portsV2.builtIn.${port1}.target`, value: null }],
      },
      {
        nodeID: 'node-2',
        patches: [{ path: ['portsV2.dynamic', { id: port2 }, 'target'], value: null }],
      },
    ]);
  });

  it('patchManyLinks', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchManyNodesData = vi.fn().mockResolvedValue(undefined);
    model.patchManyNodesData = patchManyNodesData;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const port1 = BaseModels.PortType.NO_MATCH;
    const port2 = 'port-2';
    const patches = [
      { nodeID: 'node-1', type: port1, data: { foo: 'bar', fizz: 'buzz' } as any },
      { nodeID: 'node-2', portID: port2, data: { foo: 'buzz' } as any },
    ];

    await expect(model.patchManyLinks(versionID, diagramID, patches)).resolves.toEqual(patches);

    expect(patchManyNodesData).toBeCalledWith(versionID, diagramID, [
      {
        nodeID: 'node-1',
        patches: [
          { path: `portsV2.builtIn.${port1}.data.foo`, value: 'bar' },
          { path: `portsV2.builtIn.${port1}.data.fizz`, value: 'buzz' },
        ],
      },
      {
        nodeID: 'node-2',
        patches: [{ path: ['portsV2.dynamic', { id: port2 }, 'data.foo'], value: 'buzz' }],
      },
    ]);
  });

  it('removeBuiltInPort', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const type = BaseModels.PortType.NO_MATCH;

    await expect(model.removeBuiltInPort(versionID, diagramID, { nodeID, type, removeNodes: [] })).resolves.toEqual(
      type
    );

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      model['atomicNodeData'].unset(nodeID, [{ path: DiagramModel['builtInPortPath'](type) }]),
    ]);
  });

  it('removeDynamicPort', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const portID = 'port-id';

    await expect(model.removeDynamicPort(versionID, diagramID, { nodeID, portID, removeNodes: [] })).resolves.toEqual(
      portID
    );

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      model['atomicNodeData'].pull(nodeID, [{ path: 'portsV2.dynamic', match: { id: portID } }]),
    ]);
  });

  it('removeManyPorts', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateOne = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateOne = atomicUpdateOne;

    vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue('id');

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';

    const ports = [{ type: BaseModels.PortType.NO_MATCH }, { portID: 'port-2' }, { key: 'port-3' }];

    await expect(model.removeManyPorts(versionID, diagramID, { nodeID, ports, removeNodes: [] })).resolves.toEqual(
      ports
    );

    expect(atomicUpdateOne).toBeCalledWith({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramID) }, [
      model['atomicNodeData'].unset(
        nodeID,
        ports.map((port) => ({ path: DiagramModel['portPath'](port) }))
      ),
    ]);
  });

  it('reorderPorts', async () => {
    const portID = 'port-id';
    const nodeID = 'node-id';
    const model = new DiagramModel(null as any, {} as any);
    const reorderNodeData = vi.fn().mockResolvedValue(undefined);
    (model as any).reorderNodeData = reorderNodeData;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const index = 5;

    await expect(model.reorderPorts(versionID, diagramID, nodeID, portID, index)).resolves.toEqual(portID);

    expect(reorderNodeData).toBeCalledWith(versionID, diagramID, nodeID, {
      path: 'portsV2.dynamic',
      match: { id: portID },
      index,
    });
  });

  it('addBuiltInPort', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchNodeData = vi.fn().mockResolvedValue(undefined);
    model.patchNodeData = patchNodeData;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const port = { id: 'port-id', type: BaseModels.PortType.NO_MATCH, target: null };

    await expect(model.addBuiltInPort(versionID, diagramID, nodeID, port.type, port)).resolves.toEqual(port);

    expect(patchNodeData).toBeCalledWith(versionID, diagramID, nodeID, [
      { path: `portsV2.builtIn.${port.type}`, value: port },
    ]);
  });

  it('addDynamicPort', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const pushNodeData = vi.fn().mockResolvedValue(undefined);
    model.pushNodeData = pushNodeData;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const port = { id: 'port-id', type: 'port', target: null };

    await expect(model.addDynamicPort(versionID, diagramID, nodeID, port)).resolves.toEqual(port);

    expect(pushNodeData).toBeCalledWith(versionID, diagramID, nodeID, [
      { path: 'portsV2.dynamic', value: port, index: undefined },
    ]);
  });

  it('addDynamicPort - with index', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const pushNodeData = vi.fn().mockResolvedValue(undefined);
    model.pushNodeData = pushNodeData;

    const versionID = '650857e65c2684007cec75a6';
    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const port = { id: 'port-id', type: 'port', target: null };
    const index = 5;

    await expect(model.addDynamicPort(versionID, diagramID, nodeID, port, index)).resolves.toEqual(port);

    expect(pushNodeData).toBeCalledWith(versionID, diagramID, nodeID, [
      { path: 'portsV2.dynamic', value: port, index },
    ]);
  });
});

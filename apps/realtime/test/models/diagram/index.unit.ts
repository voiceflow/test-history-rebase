import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { ObjectId } from 'bson';
import _ from 'lodash';

import DiagramModel from '@/models/diagram/index';

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
    const atomicUpdateByID = vi.fn().mockResolvedValue(data);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const nodeID2 = 'node-id-2';
    expect(
      await model.patchManyNodes(diagramID, [
        { nodeID, patch: data },
        { nodeID: nodeID2, patch: data2 },
      ])
    ).to.eql(data);

    expect(atomicUpdateByID.mock.calls).to.eql([
      [diagramID, [{ arrayFilters: [], operation: '$set', query: { 'nodes.node-id.coords': data.coords, 'nodes.node-id-2.field': data2.field } }]],
    ]);
  });

  it('addStep', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const parentNodeID = 'block-id';
    const step = { nodeID: 'node-id', type: 'type', data: { ports: [{ id: 'port-id' }] as any, steps: [] } };

    await expect(model.addStep(diagramID, { parentNodeID, step })).resolves.toEqual(step);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
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
    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const parentNodeID = 'block-id';
    const step = { nodeID: 'node-id', type: BaseNode.NodeType.INTENT, data: { ports: [{ id: 'port-id' }] as any, steps: [] } };

    await expect(model.addStep(diagramID, { parentNodeID, step })).resolves.toEqual(step);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
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
    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const parentNodeID = 'block-id';
    const step = { nodeID: 'node-id', type: 'type', data: { ports: [{ id: 'port-id' }] as any, steps: [] } };
    const index = 5;

    await expect(model.addStep(diagramID, { parentNodeID, step, index })).resolves.toEqual(step);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
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
    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const node1 = { nodeID: 'node-1', type: 'type', data: { foo: 'bar' } };
    const node2 = { nodeID: 'node-2', type: BaseNode.NodeType.INTENT, data: { fizz: 'buzz' } };
    const nodes = [node1, node2];

    await expect(model.addManyNodes(diagramID, { nodes })).resolves.toEqual(nodes);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
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
    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const node1 = { nodeID: 'node-1', type: 'type', data: { foo: 'bar' } };
    const node2 = { nodeID: 'node-2', type: 'type', data: { fizz: 'buzz' } };
    const nodes = [node1, node2];

    await expect(model.addManyNodes(diagramID, { nodes })).resolves.toEqual(nodes);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
      {
        query: { 'nodes.node-1': node1, 'nodes.node-2': node2 },
        operation: '$set',
        arrayFilters: [],
      },
    ]);
  });

  it('isolateSteps', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const sourceParentNodeID = 'source-block-id';
    const parentNode: BaseModels.BaseBlock = {
      nodeID: 'block-id',
      type: BaseModels.BaseNodeType.BLOCK,
      data: { name: 'block', color: '', steps: [] },
      coords: [10, 20] as [number, number],
    };
    const stepIDs = ['step-id'];

    await expect(model.isolateSteps({ diagramID, sourceParentNodeID, parentNode, stepIDs })).resolves.toEqual(stepIDs);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
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

    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);

    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const parentNodeID = 'block-id';
    const stepID = 'step-id';
    const index = 5;

    await expect(model.reorderSteps({ diagramID, parentNodeID, stepID, index, nodePortRemaps: [] })).resolves.toEqual(stepID);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
      {
        query: { 'nodes.block-id.data.steps': stepID },
        operation: '$pull',
        arrayFilters: [],
      },
    ]);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
      {
        query: { 'nodes.block-id.data.steps': { $each: [stepID], $position: index } },
        operation: '$push',
        arrayFilters: [],
      },
    ]);
  });

  it('transplantSteps', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const sourceParentNodeID = 'source-block-id';
    const targetParentNodeID = 'target-block-id';
    const stepIDs = ['step-id'];
    const index = 5;

    await expect(model.transplantSteps({ diagramID, sourceParentNodeID, targetParentNodeID, stepIDs, index })).resolves.toEqual(stepIDs);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
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

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodes = { foo: [10, 20] as [number, number], bar: [300, -1] as [number, number] };

    await expect(model.updateNodeCoords(diagramID, nodes)).resolves.toEqual(nodes);

    expect(patchManyNodes).toBeCalledWith(diagramID, [
      { nodeID: 'foo', patch: { coords: [10, 20] } },
      { nodeID: 'bar', patch: { coords: [300, -1] } },
    ]);
  });

  it('removeManyNodes', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const atomicUpdateByID = vi.fn().mockResolvedValue(undefined);
    model.atomicUpdateByID = atomicUpdateByID;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const stepID = 'step-id';
    const nodes = [{ parentNodeID: 'block-id', stepID }, { parentNodeID: 'markup-id' }];

    await expect(model.removeManyNodes(diagramID, { nodes })).resolves.toEqual(nodes);

    expect(atomicUpdateByID).toBeCalledWith(diagramID, [
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

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const type = BaseModels.PortType.NO_MATCH;
    const target = 'target-id';

    await model.addBuiltInLink(diagramID, nodeID, type, target);

    expect(patchNodeData).toBeCalledWith(diagramID, nodeID, [
      { path: `portsV2.builtIn.${type}.target`, value: target },
      { path: `portsV2.builtIn.${type}.data`, value: {} },
    ]);
  });

  it('addDynamicLink', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchNodeData = vi.fn().mockResolvedValue(undefined);
    model.patchNodeData = patchNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const portID = 'port-id';
    const target = 'target-id';

    await model.addDynamicLink(diagramID, nodeID, portID, target);

    expect(patchNodeData).toBeCalledWith(diagramID, nodeID, [
      { path: ['portsV2.dynamic', { id: portID }, 'target'], value: target },
      { path: ['portsV2.dynamic', { id: portID }, 'data'], value: {} },
    ]);
  });

  it('removeManyLinks', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchManyNodesData = vi.fn().mockResolvedValue(undefined);
    model.patchManyNodesData = patchManyNodesData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const port1 = BaseModels.PortType.NO_MATCH;
    const port2 = 'port-2';
    const links = [
      { nodeID: 'node-1', type: port1 },
      { nodeID: 'node-2', portID: port2 },
    ];

    await expect(model.removeManyLinks(diagramID, links)).resolves.toEqual(links);

    expect(patchManyNodesData).toBeCalledWith(diagramID, [
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

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const port1 = BaseModels.PortType.NO_MATCH;
    const port2 = 'port-2';
    const patches = [
      { nodeID: 'node-1', type: port1, data: { foo: 'bar', fizz: 'buzz' } as any },
      { nodeID: 'node-2', portID: port2, data: { foo: 'buzz' } as any },
    ];

    await expect(model.patchManyLinks(diagramID, patches)).resolves.toEqual(patches);

    expect(patchManyNodesData).toBeCalledWith(diagramID, [
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
    const unsetNodeData = vi.fn().mockResolvedValue(undefined);
    model.unsetNodeData = unsetNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const type = BaseModels.PortType.NO_MATCH;

    await expect(model.removeBuiltInPort(diagramID, nodeID, type)).resolves.toEqual(type);

    expect(unsetNodeData).toBeCalledWith(diagramID, nodeID, [{ path: `portsV2.builtIn.${type}` }]);
  });

  it('removeDynamicPort', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const pullNodeData = vi.fn().mockResolvedValue(undefined);
    model.pullNodeData = pullNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const portID = 'port-id';

    await expect(model.removeDynamicPort(diagramID, nodeID, portID)).resolves.toEqual(portID);

    expect(pullNodeData).toBeCalledWith(diagramID, nodeID, [{ path: 'portsV2.dynamic', match: { id: portID } }]);
  });

  it('removeManyPorts', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const unsetNodeData = vi.fn().mockResolvedValue(undefined);
    model.unsetNodeData = unsetNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';

    const ports = [{ type: BaseModels.PortType.NO_MATCH }, { portID: 'port-2' }, { key: 'port-3' }];

    await expect(model.removeManyPorts(diagramID, nodeID, ports)).resolves.toEqual(ports);

    expect(unsetNodeData).toBeCalledWith(diagramID, nodeID, [
      { path: `portsV2.builtIn.${ports[0].type}` },
      { path: ['portsV2.dynamic', { id: ports[1].portID }] },
      { path: `portsV2.byKey.${ports[2].key}` },
    ]);
  });

  it('reorderPorts', async () => {
    const portID = 'port-id';
    const nodeID = 'node-id';
    const model = new DiagramModel(null as any, {} as any);
    const reorderNodeData = vi.fn().mockResolvedValue(undefined);
    (model as any).reorderNodeData = reorderNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const index = 5;

    await expect(model.reorderPorts(diagramID, nodeID, portID, index)).resolves.toEqual(portID);

    expect(reorderNodeData).toBeCalledWith(diagramID, nodeID, { path: 'portsV2.dynamic', match: { id: portID }, index });
  });

  it('addBuiltInPort', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const patchNodeData = vi.fn().mockResolvedValue(undefined);
    model.patchNodeData = patchNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const port = { id: 'port-id', type: BaseModels.PortType.NO_MATCH, target: null };

    await expect(model.addBuiltInPort(diagramID, nodeID, port.type, port)).resolves.toEqual(port);

    expect(patchNodeData).toBeCalledWith(diagramID, nodeID, [{ path: `portsV2.builtIn.${port.type}`, value: port }]);
  });

  it('addDynamicPort', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const pushNodeData = vi.fn().mockResolvedValue(undefined);
    model.pushNodeData = pushNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const port = { id: 'port-id', type: 'port', target: null };

    await expect(model.addDynamicPort(diagramID, nodeID, port)).resolves.toEqual(port);

    expect(pushNodeData).toBeCalledWith(diagramID, nodeID, [{ path: 'portsV2.dynamic', value: port, index: undefined }]);
  });

  it('addDynamicPort - with index', async () => {
    const model = new DiagramModel(null as any, {} as any);
    const pushNodeData = vi.fn().mockResolvedValue(undefined);
    model.pushNodeData = pushNodeData;

    const diagramID = '5f11ac822ab2ce1957cb0d24';
    const nodeID = 'node-id';
    const port = { id: 'port-id', type: 'port', target: null };
    const index = 5;

    await expect(model.addDynamicPort(diagramID, nodeID, port, index)).resolves.toEqual(port);

    expect(pushNodeData).toBeCalledWith(diagramID, nodeID, [{ path: 'portsV2.dynamic', value: port, index }]);
  });
});

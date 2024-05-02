import { ObjectId } from 'bson';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { MongoDB } from '../_suite';
import type { DBDiagramModel } from '.';
import DiagramModel from '.';

const mockDiagram: Omit<DBDiagramModel, '_id'> = {
  name: 'Diagram 1',
  creatorID: 11,
  versionID: new ObjectId(1),
  diagramID: new ObjectId(2),

  // To pass mongo schema validation you need to pass explicitly float number
  offsetX: 1.1,
  offsetY: 1.1,
  zoom: 100.5,

  modified: 0,

  variables: ['test1'],
  nodes: {
    1: {
      nodeID: '1',
      type: 'block',
      coords: [1, 2],
      data: {
        name: 'start',
        color: 'red',
        steps: ['2'],
      },
    },
    2: {
      nodeID: '2',
      type: 'step',
      data: {
        speak: 'hello',
        ports: [],
      },
    },
  },

  children: [],
};

describe('Diagram model integrations tests', () => {
  let mongo: MongoDB;
  let model: DiagramModel;

  beforeAll(async () => {
    mongo = await MongoDB();

    model = new DiagramModel(null as any, { clients: { mongo } } as any);
    model.setup();
  });

  beforeEach(async () => {
    await mongo.db.collection(model.collectionName).deleteMany({});
  });

  afterAll(async () => {
    await mongo.stop();
  });

  describe('CRUD validation', () => {
    it('insert entry', async () => {
      const result = await mongo.db.collection(model.collectionName).insertOne(mockDiagram);

      const document = await mongo.db.collection(model.collectionName).findOne({ _id: result.insertedId });

      expect(document).toEqual(expect.objectContaining({ name: mockDiagram.name }));
    });
  });
});

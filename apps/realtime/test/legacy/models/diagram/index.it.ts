import { ObjectId } from 'bson';
import { Db, MongoClient } from 'mongodb';

import DiagramModel, { DBDiagramModel } from '@/legacy/models/diagram';
import config from '@/old_config';

const mockDiagram: Omit<DBDiagramModel, '_id'> = {
  name: 'Diagram 1',
  creatorID: 11,
  versionID: new ObjectId(1),

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
  let client: MongoClient;
  let db: Db;
  let model: DiagramModel;

  beforeAll(async () => {
    client = await MongoClient.connect(config.MONGO_URI, { useUnifiedTopology: true });
    db = client.db(config.MONGO_DB);
    model = new DiagramModel(null as any, { clients: { mongo: { db } } } as any);

    await model.setup();

    // assert init
    expect(await db.listCollections({ name: model.collectionName }, { nameOnly: true }).hasNext()).to.eql(true);
    expect(await db.indexInformation(model.collectionName)).to.eql({
      _id_: [['_id', 1]],
      versionID_1: [['versionID', 1]],
    });
  });

  beforeEach(async () => {
    await db.collection(model.collectionName).deleteMany({});
  });

  afterAll(async () => {
    await client.close();
  });

  describe('CRUD validation', () => {
    it('insert entry', async () => {
      const result = (await db.collection(model.collectionName).insertOne(mockDiagram)).ops[0];

      expect(result.name).to.eql(mockDiagram.name);
    });
  });
});

import { MigrationData } from '@realtime-sdk/migrate/migrations/types';
import migrateToV2 from '@realtime-sdk/migrate/migrations/v2_0';
import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import { produce } from 'immer';

describe('Migrate service - v2 migration unit tests', () => {
  const migrationContext = { projectType: Platform.Constants.ProjectType.CHAT, platform: Platform.Constants.PlatformType.VOICEFLOW };

  it('do not transform version', async () => {
    const data = {
      version: { _id: 'versionID' } as any,
      diagrams: [{ _id: 'diagramID', nodes: {} }],
    } as MigrationData;

    const result = produce(data, (draft) => migrateToV2(draft, migrationContext));

    expect(result.version).to.eq(data.version);
  });

  it('do not transform block nodes', async () => {
    const nodeID = 'nodeID';
    const data = {
      diagrams: [
        {
          _id: 'diagramID',
          nodes: {
            [nodeID]: {
              nodeID,
              type: BaseModels.BaseNodeType.BLOCK,
              data: {},
            },
          } as any,
        },
      ],
    } as MigrationData;
    const result = produce(data, (draft) => migrateToV2(draft, migrationContext));

    expect(result.diagrams).to.eql(data.diagrams);
  });

  it('do not transform step nodes with updated portsV2 structure', async () => {
    const nodeID = 'nodeID';
    const data = {
      diagrams: [
        {
          _id: 'diagramID',
          nodes: {
            [nodeID]: {
              nodeID,
              type: 'code',
              data: {
                code: '',
                portsV2: {
                  byKey: {},
                  builtIn: {
                    [BaseModels.PortType.NEXT]: {
                      type: BaseModels.PortType.NEXT,
                      target: null,
                      id: 'port-1',
                    },
                    [BaseModels.PortType.FAIL]: {
                      type: BaseModels.PortType.FAIL,
                      target: null,
                      id: 'port-2',
                    },
                  },
                  dynamic: [],
                },
              },
            },
          } as any,
        },
      ],
    } as MigrationData;
    const result = produce(data, (draft) => migrateToV2(draft, migrationContext));

    expect(result.diagrams).to.eql(data.diagrams);
  });

  it('transform step nodes ports to updated portsV2 structure', async () => {
    const nodeID = 'nodeID';
    const diagramID = 'diagramID';
    const nextPort = {
      type: BaseModels.PortType.NEXT,
      data: undefined,
      target: null,
      id: 'port-1',
    };
    const failPort = {
      type: BaseModels.PortType.FAIL,
      data: { color: '#efefef' },
      target: nodeID,
      id: 'port-2',
    };
    const data = {
      diagrams: [
        {
          _id: diagramID,
          nodes: {
            [nodeID]: {
              nodeID,
              type: 'code',
              data: {
                code: '',
                ports: [nextPort, failPort],
              },
            },
          } as any,
        },
      ],
    } as MigrationData;
    const result = produce(data, (draft) => migrateToV2(draft, migrationContext));

    expect(result.diagrams).to.eql([
      {
        _id: diagramID,
        nodes: {
          [nodeID]: {
            nodeID,
            type: 'code',
            data: {
              code: '',
              portsV2: {
                byKey: {},
                builtIn: {
                  [BaseModels.PortType.NEXT]: nextPort,
                  [BaseModels.PortType.FAIL]: failPort,
                },
                dynamic: [],
              },
            },
          },
        },
      },
    ]);
  });
});

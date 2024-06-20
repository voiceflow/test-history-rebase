import { MigrationData } from '@realtime-sdk/migrate/migrations/types';
import migrateToV4_04 from '@realtime-sdk/migrate/migrations/v4_04';
import * as Platform from '@voiceflow/platform-config/backend';
import { produce } from 'immer';

describe('Migrate service - v4_04 migration unit tests', () => {
  const migrationContext = {
    projectType: Platform.Constants.ProjectType.CHAT,
    platform: Platform.Constants.PlatformType.VOICEFLOW,
  };

  it('removes duplicate menuItems and topicIDs', async () => {
    const domain1 = { topicIDs: ['topicID1', 'topicID2', 'topicID1'] };
    const domain2 = { topicIDs: ['topicID3', 'topicID1', 'topicID2', 'topicID3', 'topicID4', 'topicID4', 'topicID4'] };
    const domain3 = { topicIDs: ['topicID1', 'topicID2', 'topicID3'] };

    const diagram1 = {
      diagramID: 'diagramID1',
      menuItems: [
        { type: 'NODE', sourceID: 'nodeID1' },
        { type: 'NODE', sourceID: 'nodeID2' },
        { type: 'NODE', sourceID: 'nodeID1' },
      ],
    };

    const diagram2 = {
      diagramID: 'diagramID2',
      menuItems: [
        { type: 'NODE', sourceID: 'nodeID1' },
        { type: 'NODE', sourceID: 'nodeID2' },
        { type: 'NODE', sourceID: 'nodeID1' },
        { type: 'NODE', sourceID: 'nodeID3' },
        { type: 'NODE', sourceID: 'nodeID4' },
        { type: 'NODE', sourceID: 'nodeID4' },
        { type: 'NODE', sourceID: 'nodeID4' },
        { type: 'DIAGRAM', sourceID: 'nodeID4' },
      ],
    };

    const diagram3 = {
      diagramID: 'diagramID3',
      menuItems: [
        { type: 'NODE', sourceID: 'nodeID1' },
        { type: 'NODE', sourceID: 'nodeID2' },
        { type: 'NODE', sourceID: 'nodeID3' },
      ],
    };

    const data = {
      version: { diagramID: 'versionID', domains: [domain1, domain2, domain3] } as any,
      diagrams: [diagram1, diagram2, diagram3],
    } as MigrationData;

    const result = produce(data, (draft) => migrateToV4_04(draft, migrationContext));

    expect(result.version).to.eql({
      ...data.version,
      domains: [
        { topicIDs: ['topicID1', 'topicID2'] },
        { topicIDs: ['topicID3', 'topicID1', 'topicID2', 'topicID4'] },
        domain3,
      ],
    });

    expect(result.diagrams).to.eql([
      {
        ...diagram1,
        menuItems: [
          { type: 'NODE', sourceID: 'nodeID1' },
          { type: 'NODE', sourceID: 'nodeID2' },
        ],
      },
      {
        ...diagram2,
        menuItems: [
          { type: 'NODE', sourceID: 'nodeID1' },
          { type: 'NODE', sourceID: 'nodeID2' },
          { type: 'NODE', sourceID: 'nodeID3' },
          { type: 'NODE', sourceID: 'nodeID4' },
          { type: 'DIAGRAM', sourceID: 'nodeID4' },
        ],
      },
      diagram3,
    ]);
  });
});

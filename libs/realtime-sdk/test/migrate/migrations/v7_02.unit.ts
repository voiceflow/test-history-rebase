import type { MigrationData } from '@realtime-sdk/migrate/migrations/types';
import migrateToV7_02, { LAST_UTTERANCE } from '@realtime-sdk/migrate/migrations/v7_02';
import { produce } from 'immer';

const aiSetDeprecated = {
  type: 'ai_set',
  data: {
    source: 'knowledge_base',
    sets: [{ prompt: 'prompt1' }, { prompt: 'prompt2' }],
  },
};

const aiResponseDeprecated = {
  type: 'generative',
  data: {
    source: 'knowledge_base',
    prompt: 'prompt',
  },
};

const aiSet = {
  type: 'ai_set',
  data: {
    source: 'knowledge_base',
    overrideParams: false,
    sets: [
      {
        prompt: LAST_UTTERANCE,
        instruction: 'prompt1',
      },
      {
        prompt: LAST_UTTERANCE,
        instruction: 'prompt2',
      },
    ],
  },
};

const aiResponse = {
  type: 'generative',
  data: {
    source: 'knowledge_base',
    prompt: LAST_UTTERANCE,
    instruction: 'prompt',
    notFoundPath: false,
    overrideParams: false,
  },
};

describe('Migrate service - v7_02 migration unit tests', () => {
  it('migrates kb steps', async () => {
    const diagram1 = {
      diagramID: 'diagramID1',
      nodes: {
        aiSetDeprecated,
        aiResponseDeprecated,
        aiSet,
        aiResponse,
      },
    };

    const data = { diagrams: [diagram1] } as unknown as MigrationData;

    const result = produce(data, (draft) => migrateToV7_02(draft, {} as any));

    expect(result.diagrams).to.eql([
      {
        diagramID: 'diagramID1',
        nodes: {
          aiSet,
          aiResponse,
          aiSetDeprecated: aiSet,
          aiResponseDeprecated: aiResponse,
        },
      },
    ]);
  });
});

import { Utils } from '@voiceflow/common';
import { ArrayItem } from '@voiceflow/realtime-sdk';

import { BlockCategory, BlockType } from '@/constants';

import { MOCK_DATA, PerfScenario } from '../constants';
import { runner } from '../utils';

runner.register<ArrayItem<typeof MOCK_DATA.VERSIONS>>(
  PerfScenario.NODE_RENDERED_ON_DROP_CREATE,
  async ({ commands, setPrefix, unit, setIterationData, beforeAll, afterAll, beforeEachIterationData }) => {
    setPrefix((version) => version.name);
    setIterationData(MOCK_DATA.VERSIONS);

    beforeAll(async () => {
      await commands.login();
    });

    beforeEachIterationData(async (version) => {
      await commands.goToDomain(version.id, 10000);
    });

    afterAll(async () => {
      await commands.logout();
    });

    unit(async () => {
      await commands.canvas.openDesignMenuStepsSection(BlockCategory.RESPONSE);

      // wait animation to be finished
      await Utils.promise.delay(300);

      await commands.canvas.createStepViaDesignMenu(BlockCategory.RESPONSE, BlockType.SPEAK);
    });
  }
);

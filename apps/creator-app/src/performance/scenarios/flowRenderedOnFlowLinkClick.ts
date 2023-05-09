import { ArrayItem } from '@voiceflow/realtime-sdk';

import { MOCK_DATA, PerfScenario } from '../constants';
import { PAGES, runner } from '../utils';

runner.register<ArrayItem<typeof MOCK_DATA.VERSIONS>>(
  PerfScenario.FLOW_RENDERED_ON_FLOW_LINK_CLICK,
  async ({ commands, setPrefix, unit, setIterationData, beforeAll, afterAll, beforeEach }) => {
    setPrefix((version) => version.name);
    setIterationData(MOCK_DATA.VERSIONS);

    beforeAll(async () => {
      await commands.login();
    });

    beforeEach(async (version) => {
      await commands.goToDomain(version.id, 10000);
    });

    afterAll(async () => {
      await commands.logout();
    });

    unit(async (version) => {
      await PAGES.CANVAS.flowStepLink(version.flowStepID).click();
    });
  }
);

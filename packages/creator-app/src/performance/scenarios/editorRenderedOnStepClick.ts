import _sample from 'lodash/sample';

import { MOCK_DATA, PerfScenario } from '../constants';
import { PAGES, runner } from '../utils';

runner.register<typeof MOCK_DATA.VERSIONS[number]>(
  PerfScenario.EDITOR_RENDERED_ON_STEP_CLICK,
  async ({ commands, setPrefix, unit, setIterationData, beforeAll, afterAll, afterEach, beforeEachIterationData }) => {
    setPrefix((version) => version.name);
    setIterationData(MOCK_DATA.VERSIONS);

    beforeAll(async () => {
      await commands.login();
    });

    beforeEachIterationData(async (version) => {
      await commands.goToDomain(version.id);
    });

    afterEach(async () => {
      await commands.canvas.clearFocus();
    });

    afterAll(async () => {
      await commands.logout();
    });

    unit(async (version) => {
      const nodeID = _sample(version.stepIDs)!;

      await PAGES.CANVAS.node(nodeID).click();
    });
  }
);

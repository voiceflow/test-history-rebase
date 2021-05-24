import _sample from 'lodash/sample';

import { MOCK_DATA, PerfScenario } from '../constants';
import { runner } from '../utils';

runner.register<typeof MOCK_DATA.VERSIONS[number]>(
  PerfScenario.EDITOR_RENDERED_ON_BLOCK_CLICK,
  async ({ commands, setPrefix, unit, setIterationData, beforeAll, afterAll, afterEach, beforeEachIterationData }) => {
    setPrefix((version) => version.name);
    setIterationData(MOCK_DATA.VERSIONS);

    beforeAll(async () => {
      await commands.login();
    });

    beforeEachIterationData(async (version) => {
      await commands.goToCanvas(version.id);
    });

    afterEach(async () => {
      await commands.canvas.clearFocus();
    });

    afterAll(async () => {
      await commands.logout();
    });

    unit(async (version) => {
      const nodeID = _sample(version.nodeIDs)!;

      await commands.canvas.clickNode(nodeID);
    });
  }
);

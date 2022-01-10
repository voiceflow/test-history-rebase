import * as VFMetrics from '@voiceflow/metrics';

import MetricsClient from '@/clients/metrics';
import { Config } from '@/types';

const metricsAsserter = new VFMetrics.Testing.MetricsAsserter((config) => MetricsClient({ config: config as unknown as Config }));

describe('metrics client unit tests', () => {
  it('helloWorld', async () => {
    const fixture = await metricsAsserter.assertMetric({ expected: /^hello_world_total 1 \d+$/m });

    fixture.metrics.helloWorld();

    await fixture.assert();
  });
});

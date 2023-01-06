import { Counter } from '@opentelemetry/api-metrics';
import * as VFMetrics from '@voiceflow/metrics';

import log from '@/logger';
import { Config } from '@/types';

export type { Metrics };
class Metrics extends VFMetrics.Client.Metrics {
  protected counters: {
    realtime: {
      helloWorld: Counter;
    };
  };

  constructor(config: Config) {
    super({ ...config, SERVICE_NAME: 'realtime' });

    super.once('ready', ({ port, path }: VFMetrics.Client.Events['ready']) => {
      log.info(`[metrics] exporter ready port=%s, path=%s`, port, path);
    });

    this.counters = {
      realtime: {
        helloWorld: this.meter.createCounter('hello_world', { description: 'Example metric' }),
      },
    };
  }

  helloWorld(): void {
    this.counters.realtime.helloWorld.add(1);
  }
}

const MetricsClient = (options: { config: Config }): Metrics => new Metrics(options.config);

export default MetricsClient;

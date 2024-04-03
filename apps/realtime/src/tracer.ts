import tracer from 'dd-trace';

import { APP_NAME } from './config';

tracer.init({
  service: APP_NAME,
  runtimeMetrics: true,
  profiling: true,
  logInjection: true,
  // Datadog samples traces it captures.Uncomment below to capture 100% of samples if this is required for debugging
  /* ingestion: {
  // Any traces started will be sampled at 100.00% with a rate limit of 100 per second
  sampleRate: 1.0,
}, */
});

export default tracer;

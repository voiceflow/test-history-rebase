import tracer from 'dd-trace';

tracer.init({
  runtimeMetrics: true,
});

export default tracer;

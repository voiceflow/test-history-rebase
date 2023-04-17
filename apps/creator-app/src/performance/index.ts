import { IS_PERFORMANCE_TEST } from '@/config';

export { PerfAction } from './constants';
export { default } from './harness';

if (IS_PERFORMANCE_TEST) {
  import('./scenarios');
}

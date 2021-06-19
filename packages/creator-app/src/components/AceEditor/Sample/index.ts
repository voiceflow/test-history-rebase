import { lazyComponent } from '@/hocs';

export * from './types';

const SampleEditor = lazyComponent(() => import('./sample'));

export default SampleEditor;

import { lazyComponent } from '@/hocs';

export * from './constants';

const LazyAceEditor = lazyComponent(() => import('./editor'), { forwardRef: true });

export default LazyAceEditor;

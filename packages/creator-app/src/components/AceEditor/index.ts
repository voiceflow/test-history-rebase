import { lazyComponent } from '@/hocs/lazy';

export * from './constants';

const LazyAceEditor = lazyComponent(() => import('./editor'), { forwardRef: true });

export default LazyAceEditor;

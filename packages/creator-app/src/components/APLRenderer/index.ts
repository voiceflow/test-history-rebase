import { lazyComponent } from '@/hocs/lazy';

export * from './types';

const LazyAPLRenderer = lazyComponent(() => import('./renderer'), { forwardRef: false });

export default LazyAPLRenderer;

import { lazyComponent } from '@/hocs';

export * from './types';

const LazyAPLRenderer = lazyComponent(() => import('./renderer'), { forwardRef: false });

export default LazyAPLRenderer;

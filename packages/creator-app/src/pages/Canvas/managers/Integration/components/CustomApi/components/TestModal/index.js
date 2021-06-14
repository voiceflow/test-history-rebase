import { lazyComponent } from '@/hocs';

const LazyTestModal = lazyComponent(() => import('./modal'), { fallback: () => null });

export default LazyTestModal;

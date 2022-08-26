import { IS_DEVELOPMENT } from '@/config';

import manager, { Event } from './manager';

export * from './components';
export { Provider } from './context';
export { useModal } from './hooks';
export * from './modals';

export const open = manager.open.bind(manager);
export const close = manager.close.bind(manager);
export const update = manager.update.bind(manager);
export const create = manager.create.bind(manager);
export const register = manager.register.bind(manager);

if (IS_DEVELOPMENT && import.meta.hot) {
  import.meta.hot.accept(() => manager.emit(Event.RELOAD));
}

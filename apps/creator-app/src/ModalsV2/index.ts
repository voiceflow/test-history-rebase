import manager from './manager';

export { Placeholder } from './components';
export { Provider } from './context';
export { useActiveModalID, useModal } from './hooks';
export * from './modals';
export * from './utils';

export const open = manager.open.bind(manager) as typeof manager.open;
export const close = manager.close.bind(manager) as typeof manager.close;
export const update = manager.update.bind(manager) as typeof manager.update;
export const create = manager.create.bind(manager) as typeof manager.create;
export const register = manager.register.bind(manager) as typeof manager.register;

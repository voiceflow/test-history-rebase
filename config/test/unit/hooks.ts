import mutableStore from '@/store/mutable';

export const mochaHooks = {
  afterEach: () => {
    mutableStore.reset();
  },
};

import { Utils } from '@voiceflow/common';

import { BlockCategory, BlockType } from '@/constants';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';

import { MOCK_DATA, PerfAction, RunnerEvent } from '../constants';
import dndSimulator from './dndSimulator';
import PAGES from './pages';
import type { EventTypes, Runner } from './runner';

const createCommands = (runner: Runner) => {
  const promisifyListener = <T extends RunnerEvent, R extends EventTypes[T] = EventTypes[T]>(
    event: T,
    filter: (data: EventTypes[T]) => boolean = () => true
  ): Promise<R> =>
    new Promise<R>((resolve) => {
      const callback = (data: EventTypes[T]): void => {
        if (filter(data)) {
          runner.removeListener(event, callback as any);
          resolve(data as R);
        }
      };

      runner.addListener(event, callback as any);
    });

  const commands = {
    waitAction: async <T extends PerfAction>(action: T, timeout = 10000): Promise<T> =>
      Promise.race([
        Utils.promise.rejectIn(timeout),
        promisifyListener<RunnerEvent.PERF_ACTION, T>(RunnerEvent.PERF_ACTION, (payload) => payload === action),
      ]),

    goToDomain: async (versionID: string, timeout = 5000) => {
      window.store.dispatch(Router.goToDomain({ versionID }));

      await commands.waitAction(PerfAction.CANVAS_RENDERED, timeout);
    },

    goToPrototype: async (versionID: string, timeout = 10000) => {
      window.store.dispatch(Router.goToPrototype(versionID));

      await commands.waitAction(PerfAction.PROTOTYPE_START_RENDERED, timeout);
    },

    login: async (timeout = 5000): Promise<void> => {
      window.store.dispatch(Session.signin(MOCK_DATA.LOGIN));

      await commands.waitAction(PerfAction.DASHBOARD_RENDERED, timeout);
    },

    logout: async (timeout = 5000): Promise<void> => {
      window.store.dispatch(Session.logout());

      await commands.waitAction(PerfAction.LOGIN_RENDERED, timeout);
    },

    canvas: {
      clearFocus: async () => {
        await PAGES.CANVAS.canvas().click();

        await window.vf_engine?.focus.reset();

        await Utils.promise.delay(100);
      },

      openDesignMenuStepsSection: (category: BlockCategory) => {
        if (PAGES.CANVAS.isStepMenuSectionOpened(category)) return;

        PAGES.CANVAS.stepMenuSectionHeader(category).click();
      },

      createStepViaDesignMenu: (category: BlockCategory, type: BlockType) => {
        dndSimulator(PAGES.CANVAS.stepMenuSectionStep(category, type), PAGES.CANVAS.canvas());
      },
    },
  };

  return commands;
};

export default createCommands;

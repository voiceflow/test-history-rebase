/* eslint-disable promise/no-nesting */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-param-reassign */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-depth */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */

import { isFirstOlder } from '@logux/core';
import { createNanoEvents } from 'nanoevents';
import { createStore as createReduxStore } from 'redux';

const hackReducer = (reducer) => (state, action) => {
  if (action.type === 'logux/state') {
    return action.state;
  }
  return reducer(state, action);
};

export function createStoreCreator(client, options = {}) {
  const cleanEvery = options.cleanEvery || 25;
  const saveStateEvery = options.saveStateEvery || 50;
  const { onMissedHistory } = options;
  const reasonlessHistory = options.reasonlessHistory || 1000;

  const { log } = client;

  return function createStore(reducer, preloadedState, enhancer) {
    const store = createReduxStore(hackReducer(reducer), preloadedState, enhancer);

    const emitter = createNanoEvents();

    store.client = client;
    store.log = log;
    let historyCleaned = false;
    const stateHistory = {};
    const wait = {};

    let actionCount = 0;
    function saveHistory(meta) {
      actionCount += 1;
      if (saveStateEvery === 1 || actionCount % saveStateEvery === 1) {
        stateHistory[meta.id] = store.getState();
      }
    }

    const originReplace = store.replaceReducer;
    store.replaceReducer = (newReducer) => {
      reducer = newReducer;
      return originReplace(hackReducer(newReducer));
    };

    store.on = emitter.on.bind(emitter);

    let init;
    store.initialize = new Promise((resolve) => {
      init = resolve;
    });

    let prevMeta;
    const originDispatch = store.dispatch;
    store.dispatch = (action) => {
      const meta = {
        id: log.generateId(),
        tab: store.client.tabId,
        reasons: [`timeTravelTab${store.client.tabId}`],
        dispatch: true,
      };
      log.add(action, meta);

      prevMeta = meta;
      const prevState = store.getState();
      originDispatch(action);
      emitter.emit('change', store.getState(), prevState, action, meta);
      saveHistory(meta);
    };

    store.dispatch.local = (action, meta = {}) => {
      meta.tab = client.tabId;
      if (meta.reasons || meta.keepLast) meta.noAutoReason = true;
      return log.add(action, meta);
    };

    store.dispatch.crossTab = (action, meta = {}) => {
      if (meta.reasons || meta.keepLast) meta.noAutoReason = true;
      return log.add(action, meta);
    };

    store.dispatch.sync = (action, meta = {}) => {
      if (meta.reasons || meta.keepLast) meta.noAutoReason = true;
      return client.sync(action, meta);
    };

    store.dispatch.partialSync = (action, meta = {}) =>
      new Promise((resolve) => {
        if (meta.reasons || meta.keepLast) meta.noAutoReason = true;

        const unbind = store.on('change', (_state, _prevState, _action, changeMeta) => {
          if (meta.id === changeMeta.id) {
            resolve(changeMeta);
            unbind();
          }
        });

        client.sync(action, meta);
      });

    function replaceState(state, actions, pushHistory) {
      const last = actions.length === 0 ? null : actions[actions.length - 1][1];
      const newState = actions.reduceRight((prev, [action, id]) => {
        delete wait[id];

        const changed = reducer(prev, action);
        if (pushHistory && id === last) {
          stateHistory[pushHistory] = changed;
        } else if (stateHistory[id]) {
          stateHistory[id] = changed;
        }
        return changed;
      }, state);
      originDispatch({ type: 'logux/state', state: newState });
      return newState;
    }

    let replaying;
    function replay(actionId) {
      const ignore = {};
      const actions = [];
      let replayed = false;
      let newAction;
      let collecting = true;

      replaying = new Promise((resolve) => {
        log
          .each((action, meta) => {
            if (meta.tab && meta.tab !== client.tabId) return true;

            if (collecting || !stateHistory[meta.id]) {
              if (action.type === 'logux/undo') {
                ignore[action.id] = true;
                return true;
              }
              if (action.type.startsWith('logux/')) {
                return true;
              }

              if (!ignore[meta.id]) actions.push([action, meta.id]);
              if (meta.id === actionId) {
                newAction = action;
                collecting = false;
              }

              return true;
            }
            replayed = true;
            replaceState(stateHistory[meta.id], actions);
            return false;
          })
          .then(() => {
            if (!replayed) {
              if (historyCleaned) {
                if (onMissedHistory) {
                  onMissedHistory(newAction);
                }
                for (let i = actions.length - 1; i >= 0; i--) {
                  const id = actions[i][1];
                  if (stateHistory[id]) {
                    replayed = true;
                    replaceState(stateHistory[id], actions.slice(0, i).concat([[newAction, actionId]]), id);
                    break;
                  }
                }
              }

              if (!replayed) {
                replaceState(preloadedState, actions.concat([[{ type: '@@redux/INIT' }]]));
              }
            }

            replaying = false;
            resolve();
          });
      });

      return replaying;
    }

    log.on('preadd', (action, meta) => {
      const { type } = action;
      const isLogux = type.startsWith('logux/');
      if (type === 'logux/undo') {
        meta.reasons.push('reasonsLoading');
      }
      if (!isLogux && !isFirstOlder(prevMeta, meta)) {
        meta.reasons.push('replay');
      }
      if (!isLogux && !meta.noAutoReason && !meta.dispatch) {
        meta.reasons.push('timeTravel');
      }
    });

    async function process(action, meta) {
      if (replaying) {
        wait[meta.id] = true;
        await replaying;
        if (wait[meta.id]) {
          delete wait[meta.id];
          await process(action, meta);
        }

        return;
      }

      if (action.type === 'logux/undo') {
        const [undoAction, undoMeta] = await log.byId(action.id);
        if (undoAction) {
          log.changeMeta(meta.id, {
            reasons: undoMeta.reasons.filter((i) => i !== 'syncing'),
          });
          delete stateHistory[action.id];
          await replay(action.id);
        } else {
          await log.changeMeta(meta.id, { reasons: [] });
        }
      } else if (!action.type.startsWith('logux/')) {
        if (isFirstOlder(prevMeta, meta)) {
          prevMeta = meta;
          originDispatch(action);
          if (meta.added) saveHistory(meta);
        } else {
          await replay(meta.id);
          if (meta.reasons.includes('replay')) {
            log.changeMeta(meta.id, {
              reasons: meta.reasons.filter((i) => i !== 'replay'),
            });
          }
        }
      }
    }

    let lastAdded = 0;
    let addCalls = 0;
    client.on('add', (action, meta) => {
      if (meta.added > lastAdded) lastAdded = meta.added;

      if (action.type !== 'logux/processed' && !meta.noAutoReason) {
        addCalls += 1;
        if (addCalls % cleanEvery === 0 && lastAdded > reasonlessHistory) {
          historyCleaned = true;
          log.removeReason('timeTravel', {
            maxAdded: lastAdded - reasonlessHistory,
          });
          log.removeReason(`timeTravelTab${store.client.tabId}`, {
            maxAdded: lastAdded - reasonlessHistory,
          });
        }
      }

      if (!meta.dispatch) {
        const prevState = store.getState();
        process(action, meta).then(() => {
          emitter.emit('change', store.getState(), prevState, action, meta);
        });
      }
    });

    client.on('clean', (action, meta) => {
      delete wait[meta.id];
      delete stateHistory[meta.id];
    });

    const previous = [];
    const ignores = {};
    log
      .each((action, meta) => {
        if (!meta.tab) {
          if (action.type === 'logux/undo') {
            ignores[action.id] = true;
          } else if (!ignores[meta.id]) {
            previous.push([action, meta]);
          }
        }
      })
      .then(() => {
        if (previous.length > 0) {
          Promise.all(previous.map((i) => process(...i))).then(() => init());
        } else {
          init();
        }
      });

    return store;
  };
}

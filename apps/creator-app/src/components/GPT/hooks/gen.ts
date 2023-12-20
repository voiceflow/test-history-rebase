import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { isNetworkError, toast, usePersistFunction, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { HotkeysContext } from '@/contexts/HotkeysContext';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import * as Workspace from '@/ducks/workspaceV2';
import { useHotkeyList } from '@/hooks/hotkeys';
import { useActiveProjectTypeConfig } from '@/hooks/platformConfig';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import { Hotkey } from '@/keymap';
import logger from '@/utils/logger';

import { ServerErrorStatusCode } from '../constants';

interface GenerateOptions<D> {
  locales: string[];
  quantity: number;
  examples: D[];
  projectID: string;
  workspaceID: string;
}

export interface GenOptions<T, D> {
  examples: T[];
  onAccept: (item: T[]) => void;
  generate: (options: GenerateOptions<D>) => Promise<T[]>;
  disabled?: boolean;
  examplesToDB: (items: T[]) => D[];
  dbExamplesToTrack: (items: D[]) => string[];
}

export interface GenApi<T> {
  items: T[];
  fetching: boolean;
  requestID: string;
  activeIndex: number;

  onGenerate: (options: { quantity: number; examples?: T[] }) => Promise<void>;
  onAcceptAll: VoidFunction;
  onRejectAll: VoidFunction;
  onFocusItem: (index: number) => void;
  onReplaceAll: (items: T[]) => void;
  onChangeItem: (index: number, item: T) => void;
  onRejectItem: (index: number) => void;
  onAcceptItem: (index: number) => void;
  onAcceptActiveItem: VoidFunction;
  onRejectActiveItem: VoidFunction;
}

export const useGenOptions = () => {
  const projectConfig = useActiveProjectTypeConfig();

  const locales = useSelector(VersionV2.active.localesSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  return React.useCallback(() => {
    Errors.assertWorkspaceID(workspaceID);
    Errors.assertProjectID(projectID);

    return {
      requestID: Utils.id.cuid(),
      projectID,
      workspaceID,
      locales: locales.map(projectConfig.utils.locale.toVoiceflowLocale),
    };
  }, []);
};

export const useGen = <T, D = string>({ onAccept, generate, disabled, examples, examplesToDB, dbExamplesToTrack }: GenOptions<T, D>): GenApi<T> => {
  const [, hotkeysAPI] = React.useContext(HotkeysContext)!;
  const [trackingEvents] = useTrackingEvents();

  const refreshWorkspaceQuotaDetails = useDispatch(Workspace.refreshWorkspaceQuotaDetails);

  const getGenOptions = useGenOptions();

  const [state, stateAPI] = useSmartReducerV2({
    items: [] as T[],
    dbItems: [] as D[],
    fetching: false,
    requestID: '',
    activeIndex: 0,
  });

  const onTrack = usePersistFunction((decision: 'accept' | 'reject', items: T[], dbItems: D[]) => {
    const original = dbExamplesToTrack(dbItems);
    const modified = dbExamplesToTrack(examplesToDB(items));

    trackingEvents.trackAIResultJudgement({
      decision,
      original,
      modified: modified.filter((item) => !original.includes(item)),
      requestID: state.requestID,
    });
  });

  const onGenerate = usePersistFunction(async (options: { quantity: number; examples?: T[] }) => {
    if (disabled) return;

    try {
      const requestID = Utils.id.cuid();

      stateAPI.fetching.set(true);

      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement?.blur();
      }

      const items = await generate({
        ...options,
        examples: examplesToDB(options.examples?.length ? options.examples : examples),
        ...getGenOptions(),
      });

      stateAPI.update({
        items: items.slice(0, options.quantity),
        dbItems: examplesToDB(items),
        fetching: false,
        requestID,
      });

      refreshWorkspaceQuotaDetails(Realtime.QuotaNames.TOKENS);
    } catch (error) {
      logger.error(error);

      if (isNetworkError(error) && error.statusCode === ServerErrorStatusCode.QUOTA_REACHED) {
        trackingEvents.trackAIQuotaDepleted({ quota: 0 });
        toast.error("You've reached your beta access token limit for AI Assist features.");
        return;
      }

      toast.error('Unable to generate. Please wait a moment and try again.');

      stateAPI.fetching.set(false);
    }
  });

  const onAcceptAll = usePersistFunction(() => {
    if (disabled) return;

    if (state.items.length) {
      onAccept(state.items);
      onTrack('accept', state.items, state.dbItems);
    }

    stateAPI.reset();
  });

  const onRejectAll = usePersistFunction(() => {
    if (disabled) return;

    if (state.items.length) {
      onTrack('reject', state.items, state.dbItems);
    }

    stateAPI.reset();
  });

  const onReplaceAll = usePersistFunction((items: T[]) => {
    if (disabled) return;

    stateAPI.items.set(items);
  });

  const onChangeItem = usePersistFunction((index: number, item: T) => {
    if (disabled) return;

    stateAPI.items.set((prevItems) => Utils.array.replace(prevItems, index, item));
  });

  const onAcceptItem = usePersistFunction((index: number) => {
    const item = state.items[index];

    if (disabled || !item) return;

    onAccept([item]);

    onTrack('accept', [item], [state.dbItems[index]]);

    stateAPI.update(({ items, dbItems, activeIndex }) => ({
      items: Utils.array.without(items, index),
      dbItems: Utils.array.without(dbItems, index),
      activeIndex: Math.max(Math.min(activeIndex, items.length - 2), 0),
    }));
  });

  const onRejectItem = usePersistFunction((index: number) => {
    const item = state.items[index];

    if (disabled || !item) return;

    onTrack('reject', [item], [state.dbItems[index]]);

    stateAPI.update(({ items, dbItems, activeIndex }) => ({
      items: Utils.array.without(items, index),
      dbItems: Utils.array.without(dbItems, index),
      activeIndex: Math.max(Math.min(activeIndex, items.length - 2), 0),
    }));
  });

  const onNextItem = usePersistFunction(() => {
    if (disabled) return;

    stateAPI.update(({ items, activeIndex }) => ({
      activeIndex: activeIndex < items.length - 1 ? activeIndex + 1 : 0,
    }));
  });

  const onPrevItem = usePersistFunction(() => {
    if (disabled) return;

    stateAPI.update(({ items, activeIndex }) => ({
      activeIndex: activeIndex > 0 ? activeIndex - 1 : Math.max(items.length - 1, 0),
    }));
  });

  const onFocusItem = usePersistFunction((index: number) => {
    if (disabled) return;

    stateAPI.activeIndex.set(index);
  });

  const onAcceptActiveItem = usePersistFunction(() => onAcceptItem(state.activeIndex));
  const onRejectActiveItem = usePersistFunction(() => onRejectItem(state.activeIndex));

  const hotkeysDisabled = !state.items.length || disabled;

  useHotkeyList(
    hotkeysDisabled
      ? []
      : [
          { hotkey: Hotkey.GPT_GEN_NEXT_ITEM, callback: onNextItem, preventDefault: true },
          { hotkey: Hotkey.GPT_GEN_PREV_ITEM, callback: onPrevItem, preventDefault: true },
          { hotkey: Hotkey.GPT_GEN_ACCEPT_ALL, callback: onAcceptAll, preventDefault: true },
          { hotkey: Hotkey.GPT_GEN_REJECT_ALL, callback: onRejectAll, preventDefault: true },
          { hotkey: Hotkey.GPT_GEN_ACCEPT_ITEM, callback: onAcceptActiveItem, preventDefault: true },
          { hotkey: Hotkey.GPT_GEN_REJECT_ITEM, callback: onRejectActiveItem, preventDefault: true },
        ],
    [hotkeysDisabled]
  );

  const isEmpty = !state.items.length;

  React.useEffect(() => {
    if (isEmpty || disabled) return Utils.functional.noop;

    const id = Utils.id.cuid.slug();

    hotkeysAPI.disableCanvasCloseMode.set((prev) => Utils.array.append(prev, id));
    hotkeysAPI.disableCanvasNodeDelete.set((prev) => Utils.array.append(prev, id));

    return () => {
      hotkeysAPI.disableCanvasCloseMode.set((prev) => Utils.array.withoutValue(prev, id));
      hotkeysAPI.disableCanvasNodeDelete.set((prev) => Utils.array.withoutValue(prev, id));
    };
  }, [isEmpty, disabled]);

  return {
    ...state,
    onGenerate,
    onAcceptAll,
    onRejectAll,
    onFocusItem,
    onChangeItem,
    onAcceptItem,
    onRejectItem,
    onReplaceAll,
    onAcceptActiveItem,
    onRejectActiveItem,
  };
};

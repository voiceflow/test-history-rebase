import { bind } from '@react-rxjs/core';
import { createKeyedSignal } from '@react-rxjs/utils';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { map, merge, Observable } from 'rxjs';

/*
  TODO: try to replace this with a global emitter + node-specific events re-emitted on the engine
  to see if it results in a more efficient update loop when dragging nodes
  (also adds further decoupling which should reduce the complexity of distributing these updates)
*/

export const useObservableEffect = <T>(source$: Observable<T>, handler: (next: T) => void, dependencies: any[] = []) =>
  React.useEffect(() => {
    const subscription = source$.subscribe(handler);

    return () => subscription.unsubscribe();
  }, dependencies);

const getCursorKey = ({ diagramID, creatorID }: { diagramID: string; creatorID: number }): string => [diagramID, creatorID].map(String).join('.');

export const [cursorCoordsChange$, setCursorCoords] = createKeyedSignal<
  string,
  Realtime.IO.CursorMoveBroadcastData,
  [payload: Realtime.IO.CursorMoveBroadcastData]
>(getCursorKey, (payload) => payload);

export const [cursorCoordsHide$, hideCursorCoords] = createKeyedSignal<
  string,
  Realtime.diagram.awareness.HideCursorPayload,
  [payload: Realtime.diagram.awareness.HideCursorPayload]
>(getCursorKey, (payload) => payload);

const cursorCoordsMerged$ = (param: { diagramID: string; creatorID: number }) => {
  const key = getCursorKey(param);

  return merge(cursorCoordsChange$(key).pipe(map(({ coords }) => coords)), cursorCoordsHide$(key).pipe(map(() => null)));
};

export const [useCursorCoords, cursorCoords$] = bind(cursorCoordsMerged$);

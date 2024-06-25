import { IO } from '@voiceflow/realtime-sdk';

import type { Client } from '@/client';
import type { MovementCalculator } from '@/components/Canvas/types';
import { OverlayType } from '@/pages/Canvas/constants';
import type { Pair, Point } from '@/types';

import type { IORealtimeCursorEvents } from '../components/RealtimeOverlay/contexts';
import type Engine from '.';
import { EngineConsumer } from './utils';

type IOClient = ReturnType<Client['realtimeIO']>;

class IOEngine extends EngineConsumer<{ [OverlayType.CURSOR_V2]: IORealtimeCursorEvents }> {
  log = this.engine.log.child('io');

  io: IOClient | null = null;

  diagramID: string | null = null;

  versionID: string | null = null;

  constructor(engine: Engine) {
    super(engine);
  }

  private onCursorMove = (data: IO.CursorMoveBroadcastData) => {
    this.components[OverlayType.CURSOR_V2]?.realtimeCursorMove(data);
  };

  private onNodeDragMany = ({ nodeIDs, movement, origins }: IO.NodeDragManyBroadcastData) => {
    this.engine.node.internal.translateManyOnOrigins(nodeIDs, movement, origins);
  };

  private onThreadDragMany = ({ threadIDs, movement, origins }: IO.ThreadDragManyBroadcastData) => {
    this.engine.comment.translateManyOnOrigins(threadIDs, movement, origins);
  };

  join(io: IOClient, versionID: string, diagramID: string): void {
    this.io = io;
    this.versionID = versionID;
    this.diagramID = diagramID;

    // remove any existing listeners
    this.io.removeAllListeners();

    this.io.on(IO.Event.CURSOR_MOVE, this.onCursorMove);
    this.io.on(IO.Event.NODE_DRAG_MANY, this.onNodeDragMany);
    this.io.on(IO.Event.THREAD_DRAG_MANY, this.onThreadDragMany);

    this.io.emit(IO.Event.DIAGRAM_JOIN, { versionID, diagramID });
  }

  leave(): void {
    if (!this.io || !this.diagramID || !this.versionID) return;

    this.io.off(IO.Event.CURSOR_MOVE, this.onCursorMove);
    this.io.off(IO.Event.NODE_DRAG_MANY, this.onNodeDragMany);
    this.io.off(IO.Event.THREAD_DRAG_MANY, this.onThreadDragMany);

    this.io.emit(IO.Event.DIAGRAM_LEAVE, { versionID: this.versionID, diagramID: this.diagramID });
    this.io.close();

    this.io = null;
    this.diagramID = null;
    this.versionID = null;
  }

  cursorMove(coords: Point) {
    if (!this.io || !this.diagramID || !this.versionID) return;

    const data: IO.CursorMoveUserData = {
      coords,
      versionID: this.versionID,
      diagramID: this.diagramID,
    };

    this.io.emit(IO.Event.CURSOR_MOVE, data);
  }

  nodeDragMany(nodeIDs: string[], movement: Pair<number>, origins: Point[]) {
    if (!this.io || !this.diagramID || !this.versionID) return;

    const data: IO.NodeDragManyUserData = {
      nodeIDs,
      origins,
      movement,
      versionID: this.versionID,
      diagramID: this.diagramID,
    };

    this.io.emit(IO.Event.NODE_DRAG_MANY, data);
  }

  threadDragMany(threadIDs: string[], movement: Pair<number>, origins: Point[]) {
    if (!this.io || !this.diagramID || !this.versionID) return;

    const data: IO.ThreadDragManyUserData = {
      origins,
      movement,
      versionID: this.versionID,
      diagramID: this.diagramID,
      threadIDs,
    };

    this.io.emit(IO.Event.THREAD_DRAG_MANY, data);
  }

  panViewport(movement: Pair<number>): void {
    this.components[OverlayType.CURSOR_V2]?.panViewport(movement);
  }

  zoomViewport(calculateMovement: MovementCalculator): void {
    this.components[OverlayType.CURSOR_V2]?.zoomViewport(calculateMovement);
  }

  teardown(): void {
    this.leave();
  }
}

export default IOEngine;

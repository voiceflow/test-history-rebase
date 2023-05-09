import { IO } from '@voiceflow/realtime-sdk';

import { Client } from '@/client';
import { MovementCalculator } from '@/components/Canvas/types';
import { OverlayType } from '@/pages/Canvas/constants';
import { Pair, Point } from '@/types';

import { IORealtimeCursorEvents } from '../components/RealtimeOverlay/contexts';
import type Engine from '.';
import { EngineConsumer } from './utils';

type IOClient = ReturnType<Client['realtimeIO']>;

class IOEngine extends EngineConsumer<{ [OverlayType.CURSOR_V2]: IORealtimeCursorEvents }> {
  log = this.engine.log.child('io');

  io: IOClient | null = null;

  diagramID: string | null = null;

  constructor(engine: Engine) {
    super(engine);
  }

  private onCursorMove = (data: IO.CursorMoveBroadcastData) => {
    this.components[OverlayType.CURSOR_V2]?.realtimeCursorMove(data);
  };

  private onNodeDragMany = ({ nodeIDs, movement, origins }: IO.NodeDragManyBroadcastData) => {
    this.engine.node.internal.translateManyOnOrigins(nodeIDs, movement, origins);
  };

  join(io: IOClient, diagramID: string): void {
    this.io = io;
    this.diagramID = diagramID;

    // remove any existing listeners
    this.io.removeAllListeners();

    this.io.on(IO.Event.CURSOR_MOVE, this.onCursorMove);
    this.io.on(IO.Event.NODE_DRAG_MANY, this.onNodeDragMany);

    this.io.emit(IO.Event.DIAGRAM_JOIN, { diagramID });
  }

  leave(): void {
    if (!this.io || !this.diagramID) return;

    this.io.off(IO.Event.CURSOR_MOVE, this.onCursorMove);
    this.io.off(IO.Event.NODE_DRAG_MANY, this.onNodeDragMany);

    this.io.emit(IO.Event.DIAGRAM_LEAVE, { diagramID: this.diagramID });
    this.io.close();

    this.io = null;
    this.diagramID = null;
  }

  cursorMove(coords: Point) {
    if (!this.io || !this.diagramID) return;

    const data: IO.CursorMoveUserData = {
      coords,
      diagramID: this.diagramID,
    };

    this.io.emit(IO.Event.CURSOR_MOVE, data);
  }

  nodeDragMany(nodeIDs: string[], movement: Pair<number>, origins: Point[]) {
    if (!this.io || !this.diagramID) return;

    const data: IO.NodeDragManyUserData = {
      nodeIDs,
      origins,
      movement,
      diagramID: this.diagramID,
    };

    this.io.emit(IO.Event.NODE_DRAG_MANY, data);
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

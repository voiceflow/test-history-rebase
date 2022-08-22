import { MovementCalculator } from '@/components/Canvas/types';
import * as Realtime from '@/ducks/realtime';
import { RealtimeSubscriptionValue } from '@/gates/RealtimeLoadingGate/contexts';
import { OverlayType } from '@/pages/Canvas/constants';
import { RealtimeCursorOverlayAPI } from '@/pages/Canvas/types';
import { Pair } from '@/types';
import * as Sentry from '@/vendors/sentry';

import type Engine from '.';
import { EngineConsumer } from './utils';

const SKIP_WARNING_ACTIONS: string[] = [Realtime.SocketAction.RECONNECT_NOOP];

class RealtimeEngine extends EngineConsumer<{ [OverlayType.CURSOR]: RealtimeCursorOverlayAPI }> {
  log = this.engine.log.child('realtime');

  teardownHandlers: () => void;

  constructor(subscription: RealtimeSubscriptionValue, engine: Engine) {
    super(engine);

    this.teardownHandlers = subscription.onUpdate(async (action, otherTabID, options = {}) => {
      const isRegistered = this.select(Realtime.isTabRegisteredSelector)(otherTabID);

      if (!isRegistered) {
        Sentry.error(`Unable to apply realtime action from unregistered tab: ${otherTabID}`);
        return;
      }

      if (action && action.type in this.handlers) {
        await this.handlers[action.type as Realtime.SocketAction]!(action.payload, otherTabID, options);
      } else if (!action || !SKIP_WARNING_ACTIONS.includes(action.type)) {
        Sentry.error(`Failed to apply unknown realtime action: ${action?.type}`);
      }
    });
  }

  handlers: Partial<Record<Realtime.SocketAction, (payload: any, tabID: string, options?: { volatile?: boolean }) => Promise<void> | unknown>> = {};

  sendUpdate(action: Realtime.AnySocketAction): Promise<void> {
    Sentry.breadcrumb('realtime', 'Sending diagram update', { type: action.type });

    return this.dispatch(Realtime.sendRealtimeUpdate(action));
  }

  sendVolatileUpdate(action: Realtime.AnySocketAction): void {
    return this.dispatch(Realtime.sendRealtimeVolatileUpdate(action));
  }

  sendProjectUpdate(action: Realtime.AnySocketAction): Promise<void> {
    Sentry.breadcrumb('realtime', 'Sending project update', { type: action.type });

    return this.dispatch(Realtime.sendRealtimeProjectUpdate(action));
  }

  panViewport(movement: Pair<number>): void {
    this.components[OverlayType.CURSOR]?.panViewport(movement);
  }

  zoomViewport(calculateMovement: MovementCalculator): void {
    this.components[OverlayType.CURSOR]?.zoomViewport(calculateMovement);
  }

  teardown(): void {
    this.teardownHandlers();
  }
}

export default RealtimeEngine;

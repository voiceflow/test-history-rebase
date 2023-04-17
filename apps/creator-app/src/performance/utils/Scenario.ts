import { PerfAction, PerfScenario, SCENARIOS_ACTIONS_MAP } from '../constants';
import Logger from './logger';

type TypedAction = `${string}:${PerfScenario}:${PerfAction}`;

export type RunCallback = (options: RunCallbackOptions) => void;
export type PrepareCleanupCallback = () => Promise<void>;

export interface RunCallbackOptions {
  reject: () => void;
}

class Scenario {
  private static createTypedAction(prefix: string, type: PerfScenario, action: PerfAction): TypedAction {
    return `${prefix}:${type}:${action}` as const;
  }

  private type: PerfScenario;

  private prefix: string;

  private logger: typeof Logger;

  private endMark: TypedAction;

  private startMark: TypedAction;

  private finishPromise: Promise<void>;

  private rejectTimeout: number;

  private startMarkTriggered = false;

  private rejectPromise!: (error?: string) => void;

  private resolvePromise!: () => void;

  constructor({ type, prefix, rejectTimeout }: { type: PerfScenario; prefix: string; rejectTimeout: number }) {
    this.type = type;
    this.prefix = prefix;
    this.logger = Logger.child(`scenario:${prefix}:${type}`);
    this.endMark = Scenario.createTypedAction(prefix, type, SCENARIOS_ACTIONS_MAP[type][1]);
    this.startMark = Scenario.createTypedAction(prefix, type, SCENARIOS_ACTIONS_MAP[type][0]);
    this.rejectTimeout = rejectTimeout;

    this.finishPromise = new Promise((resolve, reject) => {
      this.rejectPromise = reject;
      this.resolvePromise = resolve;
    });
  }

  async run(callback: RunCallback): Promise<void> {
    // eslint-disable-next-line callback-return
    callback({ reject: this.rejectPromise });

    setTimeout(() => this.rejectPromise('Rejected by timeout!'), this.rejectTimeout);

    await this.finishPromise;
  }

  action(action: PerfAction): void {
    const typedAction = Scenario.createTypedAction(this.prefix, this.type, action);

    if (typedAction === this.startMark) {
      if (!this.startMarkTriggered) {
        this.startMarkTriggered = true;

        performance.mark(typedAction);
      } else {
        this.logger.warn('The start mark is already set!');
      }
    } else if (typedAction === this.endMark) {
      if (this.startMarkTriggered) {
        performance.mark(typedAction);
        performance.measure(`${this.prefix}:${this.type}`, this.startMark, this.endMark);

        this.resolvePromise();
      } else {
        this.logger.warn('The start mark is not set yet!');
      }
    }
  }
}

export default Scenario;

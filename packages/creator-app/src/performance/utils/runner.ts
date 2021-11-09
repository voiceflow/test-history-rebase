import { Utils } from '@voiceflow/common';
import EventEmitter from 'eventemitter3';
import _groupBy from 'lodash/groupBy';
import _sumBy from 'lodash/sumBy';

import { isDebug } from '@/config';

import { PerfAction, PerfScenario, RunnerEvent } from '../constants';
import createCommands from './commands';
import logger from './logger';
import Scenario from './Scenario';

export interface EventTypes {
  [RunnerEvent.PERF_ACTION]: PerfAction;
}

type UnitCallback<T> = (data: T) => void | Promise<void>;
type MetaCallback = () => void | Promise<void>;
type PrefixCallback<T> = (data: T) => string;
type MetaEachCallback<T> = (data: T) => void | Promise<void>;

interface ScenarioCreatorConfig<T> {
  logger: typeof logger;
  commands: ReturnType<typeof createCommands>;

  /**
   * the main scenario code, it this method 'start' and 'end' actions should be fired
   */
  unit: (callback: UnitCallback<T>) => void;

  /**
   * runs after all scenario iterations
   */
  afterAll: (callback: MetaCallback) => void;

  /**
   * runs after each scenario iterations
   */
  afterEach: (callback: MetaEachCallback<T>) => void;

  /**
   * runs before all scenario iterations
   */
  beforeAll: (callback: MetaCallback) => void;

  /**
   * sets the prefix, should be used with the setIterationData method, will be called for each iteration data item
   */
  setPrefix: (callback: PrefixCallback<T>) => void;

  /**
   * runs before each scenario iterations
   */
  beforeEach: (callback: MetaEachCallback<T>) => void;

  /**
   * sets max time for scenario
   */
  setRejectTimeout: (timeout: number) => void;

  /**
   * sets the data on which scenario should iterate
   */
  setIterationData: (data: T[]) => void;

  /**
   * sets the iterations count - the number of scenario runs to calculate average performance
   */
  setIterationsCount: (count: number) => void;

  /**
   * runs after each data iterations
   */
  afterEachIterationData: (callback: MetaEachCallback<T>) => void;

  /**
   * runs before each data iteration iterations
   */
  beforeEachIterationData: (callback: MetaEachCallback<T>) => void;
}

type ScenarioCreator<T> = (callbacks: ScenarioCreatorConfig<T>) => void;

type Measures = Partial<Record<PerfScenario, number>>;

interface ScenarioData<T> {
  unit: UnitCallback<T>;
  afterAll?: MetaCallback;
  setPrefix: PrefixCallback<T>;
  afterEach?: MetaEachCallback<T>;
  beforeAll?: MetaCallback;
  beforeEach?: MetaEachCallback<T>;
  rejectTimeout: number;
  iterationData: T[];
  iterationsCount: number;
  afterEachIterationData?: MetaEachCallback<T>;
  beforeEachIterationData?: MetaEachCallback<T>;
}

type ScenarioMap<T> = Partial<Record<PerfScenario, ScenarioData<T>>>;

declare global {
  interface Window {
    PerfScenario: typeof PerfScenario;
    performanceRunner: Runner;
  }
}

const DEFAULT_ITERATION_COUNT = 5;

export class Runner extends EventEmitter<EventTypes> {
  private commands = createCommands(this);

  private disabled = true;

  private scenarioMap: ScenarioMap<unknown> = {};

  public activeScenario?: Scenario;

  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  register<T>(type: PerfScenario, scenarioCreator: ScenarioCreator<T>): void {
    if (this.scenarioMap[type]) {
      logger.warn(`"${type}" is already registered, skipping`);
    }

    let unit!: UnitCallback<unknown>;
    let afterAll: MetaCallback | undefined;
    let setPrefix: PrefixCallback<unknown> = () => 'NORMAL';
    let afterEach: MetaEachCallback<unknown> | undefined;
    let beforeAll: MetaCallback | undefined;
    let beforeEach: MetaEachCallback<unknown> | undefined;
    let iterationData: unknown[] = [1]; // to run scenario at least 1 time
    let rejectTimeout = 100000;
    let iterationsCount = isDebug() ? 3 : DEFAULT_ITERATION_COUNT;
    let afterEachIterationData: MetaEachCallback<unknown> | undefined;
    let beforeEachIterationData: MetaEachCallback<unknown> | undefined;

    scenarioCreator({
      logger: logger.child(type),

      commands: this.commands,

      unit: (callback) => {
        unit = callback as UnitCallback<unknown>;
      },

      afterAll: (callback) => {
        afterAll = callback;
      },

      afterEach: (callback) => {
        afterEach = callback as MetaEachCallback<unknown>;
      },

      setPrefix: (callback) => {
        setPrefix = callback as PrefixCallback<unknown>;
      },

      beforeAll: (callback) => {
        beforeAll = callback;
      },

      beforeEach: (callback) => {
        beforeEach = callback as MetaEachCallback<unknown>;
      },

      setIterationData: (data) => {
        if (data.length) {
          iterationData = data;
        }
      },

      setRejectTimeout: (timeout) => {
        rejectTimeout = timeout;
      },

      setIterationsCount: (count) => {
        iterationsCount = count;
      },

      afterEachIterationData: (callback) => {
        afterEachIterationData = callback as MetaEachCallback<unknown>;
      },

      beforeEachIterationData: (callback) => {
        beforeEachIterationData = callback as MetaEachCallback<unknown>;
      },
    });

    this.scenarioMap[type] = {
      unit,
      afterAll,
      afterEach,
      beforeAll,
      setPrefix,
      beforeEach,
      iterationData,
      rejectTimeout,
      iterationsCount,
      afterEachIterationData,
      beforeEachIterationData,
    };
  }

  async run(scenarios: PerfScenario[]): Promise<void> {
    if (this.disabled) {
      return;
    }

    await Utils.array.asyncForEach(scenarios, async (type) => {
      const scenario = this.scenarioMap[type];

      if (!scenario) {
        logger.warn(`"${type}" scenario runner doesn't exist`);

        return;
      }

      let stage = 'beforeAll';

      try {
        await scenario.beforeAll?.();

        await Utils.array.asyncForEach(scenario.iterationData, async (data) => {
          stage = 'beforeEachIterationData';
          await scenario.beforeEachIterationData?.(data);

          for (let i = 0; i < scenario.iterationsCount; i++) {
            stage = 'beforeEach';
            // eslint-disable-next-line no-await-in-loop
            await scenario.beforeEach?.(data);

            const prefix = scenario.setPrefix(data);

            try {
              const activeScenario = new Scenario({ type, prefix, rejectTimeout: scenario.rejectTimeout });

              this.activeScenario = activeScenario;

              // eslint-disable-next-line no-await-in-loop
              await activeScenario.run(() => scenario.unit(data));
            } catch (error) {
              logger.error({ type, prefix, error });
            }

            this.activeScenario = undefined;

            stage = 'afterEach';
            // eslint-disable-next-line no-await-in-loop
            await scenario.afterEach?.(data);
          }

          stage = 'afterEachIterationData';
          await scenario.afterEachIterationData?.(data);
        });

        stage = 'afterAll';
        await scenario.afterAll?.();
      } catch (error) {
        logger.error({ type, stage, error });
      }
    });

    const measures = this.collectMeasures(scenarios);

    logger.info(measures);
  }

  collectMeasures(scenarios: PerfScenario[]): Measures {
    if (this.disabled) {
      return {};
    }

    const entries = performance.getEntriesByType('measure').filter((entry) => scenarios.some((scenario) => entry.name.includes(scenario)));

    const groupedMeasures = _groupBy(entries, 'name');

    return Object.keys(groupedMeasures).reduce<Measures>(
      (acc, key) => Object.assign(acc, { [key as PerfScenario]: _sumBy(groupedMeasures[key], 'duration') / groupedMeasures[key].length }),
      {}
    );
  }
}

const runner = new Runner();

if (isDebug()) {
  window.PerfScenario = PerfScenario;
  window.performanceRunner = runner;
}

export default runner;

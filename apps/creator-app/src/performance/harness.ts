import { IS_PERFORMANCE_TEST } from '@/config';

import { PerfAction, RunnerEvent } from './constants';
import { runner } from './utils';

class Harness {
  private disabled: boolean;

  constructor({ disabled }: { disabled: boolean }) {
    this.disabled = disabled;
  }

  action(action: PerfAction): void {
    if (this.disabled) {
      return;
    }

    runner.emit(RunnerEvent.PERF_ACTION, action);

    if (runner.activeScenario) {
      runner.activeScenario.action(action);
    }
  }
}

runner.setDisabled(!IS_PERFORMANCE_TEST);

const harness = new Harness({ disabled: !IS_PERFORMANCE_TEST });

export default harness;

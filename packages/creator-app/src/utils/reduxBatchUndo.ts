import { Utils } from '@voiceflow/common';
import { groupByActionTypes, GroupByFunction } from 'redux-undo';

class ReduxBatchUndo {
  private group: string | null = null;

  start = (group = Utils.id.cuid()) => {
    this.group = group;
  };

  end = () => {
    this.group = null;
  };

  init = (actions: string[] = []): GroupByFunction => {
    const defaultGroupBy = groupByActionTypes(actions);

    return (...args) => this.group || defaultGroupBy(...args);
  };
}

export default new ReduxBatchUndo();

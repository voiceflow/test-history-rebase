import DatasourceSelect from './components/DatasourceSelect';
import DateRangeSelect from './components/DateRangeSelect';

export enum FilterMenuSections {
  DATE_RANGE = 'DATE_RANGE',
  DATA_SOURCE = 'DATA_SOURCE',
}

export const FILTER_MENU_SECTIONS: Record<FilterMenuSections, { title: string; component: React.FC }> = {
  [FilterMenuSections.DATE_RANGE]: { title: 'Date range', component: DateRangeSelect },
  [FilterMenuSections.DATA_SOURCE]: { title: 'Data source', component: DatasourceSelect },
};

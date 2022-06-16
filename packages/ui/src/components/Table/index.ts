import { Column, Configurable, Header, Row, Table } from './components';
import { useContext } from './context';
import { useFilterOrderItems } from './hooks';

export * as TableTypes from './types';

export default Object.assign(Table, {
  useContext,
  useFilterOrderItems,

  Row,
  Column,
  Header,
  Configurable,
});

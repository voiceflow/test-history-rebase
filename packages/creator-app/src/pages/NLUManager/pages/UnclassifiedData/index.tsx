import { Table } from '@voiceflow/ui';
import React from 'react';

import EmptyScreen from './components/EmptyScreen';

const UnclassifiedData: React.FC = () => {
  return <Table.Configurable empty={<EmptyScreen />} items={[]} orderBy={null} columns={[]} renderRow={() => {}} onChangeOrderBy={() => {}} />;
};

export default UnclassifiedData;

import { IconVariant, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import VirtualList from '@/components/VirtualList';

import Header from './Header';
import SearchInput from './SearchInput';

const TopicsSection = () => {
  return (
    <VirtualList
      header={
        <Header label="Topics" rightAction={<SvgIcon icon="outlinedAdd" variant={IconVariant.STANDARD} clickable />}>
          <SearchInput placeholder="Search" />
        </Header>
      }
      size={5}
      renderItem={(index) => <div>item {index}</div>}
    />
  );
};

export default TopicsSection;

import React from 'react';

import VirtualList from '@/components/VirtualList';

import Header from './Header';

interface ComponentsSectionProps {
  collapsed: boolean;
}

const ComponentsSection: React.FC<ComponentsSectionProps> = ({ collapsed }) => {
  return <VirtualList header={<Header label="Components" forceSticky={collapsed} />} size={5} renderItem={(index) => <div>item {index}</div>} />;
};

export default ComponentsSection;

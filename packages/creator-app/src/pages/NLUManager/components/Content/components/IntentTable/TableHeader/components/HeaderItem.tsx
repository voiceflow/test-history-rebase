import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { HeaderItem as HeaderItemComponent, OrderBox } from '@/pages/NLUManager/components/Content/components/Table/components';

interface HeaderItemProps {
  column: any;
  setOrderType: (type: string) => void;
  orderType: string;
  orderDirection: boolean;
  sorters: Record<string, (a: any, b: any) => number>;
}

const HeaderItem: React.FC<HeaderItemProps> = ({ column, setOrderType, orderType, sorters, orderDirection }) => {
  const { name, flexWidth, Tooltip } = column;
  const isActive = name === orderType;
  const hasSorter = !!sorters[name];
  const NameWrapper = Tooltip ? TippyTooltip : React.Fragment;
  const nameWrapperProps = Tooltip
    ? {
        interactive: true,
        html: <Tooltip />,
      }
    : {};
  // eslint-disable-next-line no-nested-ternary
  const nubUpColor = isActive ? (orderDirection ? '#becedc' : '#132144') : '#becedc';
  // eslint-disable-next-line no-nested-ternary
  const nubDownColor = isActive ? (orderDirection ? '#132144' : '#becedc') : '#becedc';
  return (
    <HeaderItemComponent hasSorter={hasSorter} isActive={isActive} key={name} flex={flexWidth} onClick={() => hasSorter && setOrderType(name)}>
      <NameWrapper {...nameWrapperProps}>
        <span style={hasSorter ? { cursor: 'pointer' } : undefined}>{name}</span>
      </NameWrapper>
      {hasSorter && (
        <OrderBox show={isActive} width={20} ml={6} position="relative" top="1px">
          <SvgIcon icon="nubUp" color={nubUpColor} size={7} style={{ position: 'relative', top: '0px' }} />
          <SvgIcon icon="nubDown" size={7} color={nubDownColor} />
        </OrderBox>
      )}
    </HeaderItemComponent>
  );
};

export default HeaderItem;

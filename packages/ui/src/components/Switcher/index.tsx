import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import React from 'react';

import * as S from './styles';

interface SwitcherItem {
  tabID: string;
  icon: SvgIconTypes.Icon;
}

interface SwitcherProps {
  value: string;
  items: SwitcherItem[];
  onChange: (value: string) => void;
}

const Switcher: React.FC<SwitcherProps> = ({ value, items, onChange }) => {
  if (items.length < 2) return null;

  return (
    <S.SwitcherContainer>
      <S.Slider isActive={value === items[0].tabID} />

      {items.map((item) => (
        <S.SwitcherButton isActive={value === item.tabID} onClick={() => onChange(item.tabID)} key={item.tabID}>
          <SvgIcon icon={item.icon} size={16} color={item.tabID === value ? '#132144' : '#6E849A'} style={{ zIndex: 1 }} />
        </S.SwitcherButton>
      ))}
    </S.SwitcherContainer>
  );
};

export default Switcher;

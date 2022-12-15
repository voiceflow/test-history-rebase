import Loader from '@ui/components/Loader';
import Popper from '@ui/components/Popper';
import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import React from 'react';

import * as S from './styles';

interface SwitcherItem {
  tabID: string;
  icon: SvgIconTypes.Icon;
  tooltip?: React.ReactNode;
}

interface SwitcherProps {
  value: string;
  items: SwitcherItem[];
  onChange: (value: string) => void;
  isLoading?: boolean;
}

const Switcher: React.FC<SwitcherProps> = ({ value, items, onChange, isLoading }) => {
  if (items.length < 2) return null;

  return (
    <S.SwitcherContainer>
      <S.Slider isActive={value === items[0].tabID} />

      {items.map((item) => (
        <S.SwitcherButton isActive={value === item.tabID} onClick={() => onChange(item.tabID)} key={item.tabID}>
          <>
            {value === item.tabID && isLoading ? (
              <Loader isMd />
            ) : (
              <Popper renderContent={({ onClose }) => <div onMouseLeave={() => onClose()}>{item.tooltip}</div>}>
                {({ ref, onToggle }) => (
                  <SvgIcon
                    ref={ref}
                    onMouseEnter={() => {
                      if (!item.tooltip) return;
                      onToggle();
                    }}
                    icon={item.icon}
                    size={16}
                    color={item.tabID === value ? '#132144' : '#6E849A'}
                    style={{ zIndex: 1 }}
                    clickable
                  />
                )}
              </Popper>
            )}
          </>
        </S.SwitcherButton>
      ))}
    </S.SwitcherContainer>
  );
};

export default Switcher;

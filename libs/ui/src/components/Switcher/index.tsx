import Loader from '@ui/components/Loader';
import Popper from '@ui/components/Popper';
import type { SvgIconTypes } from '@ui/components/SvgIcon';
import SvgIcon from '@ui/components/SvgIcon';
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
  const [currentItem, setCurrentItem] = React.useState(value);
  if (items.length < 2) return null;

  return (
    <S.SwitcherContainer>
      <S.Slider isActive={currentItem === items[0].tabID} />

      {items.map((item) => (
        <Popper renderContent={() => <div>{item.tooltip}</div>} key={item.tabID}>
          {({ ref, onToggle }) => (
            <S.SwitcherButton
              isActive={currentItem === item.tabID}
              onClick={() => {
                onChange(item.tabID);
                setCurrentItem(item.tabID);
              }}
              ref={ref}
            >
              <>
                {currentItem === item.tabID && isLoading ? (
                  <Loader isMd />
                ) : (
                  <SvgIcon
                    onMouseEnter={() => {
                      if (!item.tooltip) return;
                      onToggle();
                    }}
                    icon={item.icon}
                    size={16}
                    color={item.tabID === currentItem ? '#132144' : SvgIcon.DEFAULT_COLOR}
                    style={{ zIndex: 1 }}
                    clickable
                  />
                )}
              </>
            </S.SwitcherButton>
          )}
        </Popper>
      ))}
    </S.SwitcherContainer>
  );
};

export default Switcher;

import React from 'react';

import BaseDropdown from '@/components/Dropdown';
import { MarkupModeType } from '@/constants';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { stopImmediatePropagation } from '@/utils/dom';

import MenuIcon from '../MenuIcon';
import { ShapesContainer, ShapesWrapper } from './components';

const Dropdown: any = BaseDropdown;

const AddShapesMenu: React.FC = () => {
  const { modeType, setModeType } = React.useContext(MarkupModeContext)!;

  const onClick = (mode: MarkupModeType) => () => (modeType && mode === modeType ? setModeType(null) : setModeType(mode));

  return (
    <Dropdown
      placement="right"
      menu={
        <ShapesContainer column>
          <ShapesWrapper
            icon="rectangle"
            onClick={stopImmediatePropagation(onClick(MarkupModeType.SQUARE))}
            active={modeType === MarkupModeType.SQUARE}
          />
          <ShapesWrapper
            icon="circle"
            onClick={stopImmediatePropagation(onClick(MarkupModeType.CIRCLE))}
            active={modeType === MarkupModeType.CIRCLE}
          />
          <ShapesWrapper icon="line" onClick={stopImmediatePropagation(onClick(MarkupModeType.LINE))} active={modeType === MarkupModeType.LINE} />
          <ShapesWrapper icon="arrow" onClick={stopImmediatePropagation(onClick(MarkupModeType.ARROW))} active={modeType === MarkupModeType.ARROW} />
        </ShapesContainer>
      }
    >
      {(ref: React.Ref<HTMLButtonElement>, onToggle: () => void, isOpen: boolean) => (
        <MenuIcon
          ref={ref}
          large
          icon="frame"
          onClick={stopImmediatePropagation(() => {
            setModeType(null);
            onToggle();
          })}
          active={isOpen}
        />
      )}
    </Dropdown>
  );
};

export default AddShapesMenu;

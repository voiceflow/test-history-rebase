import React from 'react';

import BaseDropdown from '@/components/Dropdown';
import { MarkupShapeType } from '@/constants';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { stopImmediatePropagation } from '@/utils/dom';

import MenuIcon from '../MenuIcon';
import { ShapesContainer, ShapesWrapper } from './components';

const Dropdown: any = BaseDropdown;

const AddShapesMenu: React.FC = () => {
  const { modeType, setCreatingModeType } = React.useContext(MarkupModeContext)!;

  const onClick = (type: MarkupShapeType) => stopImmediatePropagation(() => setCreatingModeType(modeType && type === modeType ? null : type));

  return (
    <Dropdown
      placement="right"
      menu={
        <ShapesContainer column>
          <ShapesWrapper icon="rectangle" onClick={onClick(MarkupShapeType.RECTANGLE)} active={modeType === MarkupShapeType.RECTANGLE} />
          <ShapesWrapper icon="circle" onClick={onClick(MarkupShapeType.CIRCLE)} active={modeType === MarkupShapeType.CIRCLE} />
          <ShapesWrapper icon="line" onClick={onClick(MarkupShapeType.LINE)} active={modeType === MarkupShapeType.LINE} />
          <ShapesWrapper icon="arrow" onClick={onClick(MarkupShapeType.ARROW)} active={modeType === MarkupShapeType.ARROW} />
        </ShapesContainer>
      }
    >
      {(ref: React.Ref<HTMLButtonElement>, onToggle: () => void, isOpen: boolean) => (
        <MenuIcon
          ref={ref}
          large
          icon="frame"
          onClick={stopImmediatePropagation(() => {
            onToggle();
            setCreatingModeType(null);
          })}
          active={isOpen}
        />
      )}
    </Dropdown>
  );
};

export default AddShapesMenu;

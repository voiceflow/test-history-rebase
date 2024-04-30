import React from 'react';

import { isDefaultColor } from '@/components/ColorPicker/utils';
import ContextMenu from '@/components/ContextMenu';
import type { MenuTypes } from '@/components/Menu';
import { toast } from '@/components/Toast';
import { styled, transition } from '@/styles';
import { stopPropagation } from '@/utils';
import { isHexColor } from '@/utils/colors';
import { STANDARD_GRADE } from '@/utils/colors/hsl';

import TippyTooltip from '../../../TippyTooltip';
import { AddNamePopper } from '../Poppers/AddNamePopper';
import { Tooltip, WrapperTooltip } from './styles';
import type { BaseColorProps, ColorProps } from './types';

const ColorCircle = styled.div<BaseColorProps>`
  ${({ small }) =>
    small
      ? `
          width: 18px;
          height: 18px;
        `
      : `
          width: 22px;
          height: 22px;
        `}

  position: relative;
  border-radius: 50%;
  box-shadow: inset 0 -2px 0 0 #0000001e;
  background: ${({ background }) => background};
  background-blend-mode: screen;
  cursor: pointer;
`;

const ColorWrapper = styled.div<BaseColorProps>`
  ${transition('transform')}

  border-radius: 50%;
  border: solid 2px;
  padding: ${({ small }) => (small ? '2px' : '3.5px')};
  ${({ selected, background }) =>
    selected
      ? `
        border-color: #3d82e2;
      `
      : `
        border-color: ${background}22;
        background: ${background}22;
      `}

  &:hover {
    transform: scale(1.1);
  }
`;

export const Color: React.FC<ColorProps> = ({
  selected,
  colorData,
  name,
  background,
  small,
  onClick,
  isNew,
  editCustomTheme,
  removeCustomTheme,
  addCustomTheme,
  disableContextMenu,
}): React.ReactElement => {
  const [renaming, setRenaming] = React.useState(isNew);

  const isDefault = React.useMemo(
    () => !!colorData?.palette && isDefaultColor(colorData.palette[STANDARD_GRADE]),
    [colorData?.palette[STANDARD_GRADE]]
  );

  const onRename = (newName: string) => {
    const theme = {
      name: newName,
      palette: colorData!.palette,
      standardColor: colorData!.standardColor,
    };

    if (isNew) {
      addCustomTheme?.(theme);
    } else {
      editCustomTheme?.(theme);
    }

    setRenaming(false);
  };

  const menuOptions: MenuTypes.OptionWithoutValue[] =
    isDefault || disableContextMenu
      ? []
      : [
          {
            key: 'rename',
            label: 'Rename',
            onClick: () => setRenaming(true),
          },
          {
            key: 'remove',
            label: 'Remove',
            disabled: isDefault,
            onClick: async () => {
              await removeCustomTheme?.(colorData!);
              toast.success('Color successfully removed');
            },
          },
        ];

  return (
    <ContextMenu dismissEvent="mousedown" selfDismiss options={menuOptions}>
      {({ onContextMenu }) => (
        <TippyTooltip
          disabled={!name}
          content={
            <WrapperTooltip>
              <Tooltip>{name}</Tooltip>
            </WrapperTooltip>
          }
        >
          <ColorWrapper
            selected={selected}
            colorData={colorData}
            onContextMenu={stopPropagation(onContextMenu)}
            background={isHexColor(background) ? background : '#a7a7a7'}
          >
            <ColorCircle
              background={background}
              colorData={colorData}
              small={small}
              selected={selected}
              onClick={onClick}
            />
          </ColorWrapper>

          {renaming && <AddNamePopper value={name} isEditing onRename={onRename} />}
        </TippyTooltip>
      )}
    </ContextMenu>
  );
};

import { isDefaultColor } from '@ui/components/ColorPicker/utils';
import ContextMenu from '@ui/components/ContextMenu';
import { MenuOption } from '@ui/components/Menu';
import { toast } from '@ui/components/Toast';
import { useLinkedState } from '@ui/hooks';
import { transition } from '@ui/styles';
import { stopPropagation } from '@ui/utils';
import { isHexColor } from '@ui/utils/colors';
import { STANDARD_GRADE } from '@ui/utils/colors/hsl';
import React from 'react';
import styled from 'styled-components';

import TippyTooltip from '../../../TippyTooltip';
import { AddNamePopper } from '../Poppers/AddNamePopper';
import { Tooltip, WrapperTooltip } from './styles';
import { BaseColorProps, ColorProps } from './types';

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
  editCustomTheme,
  removeCustomTheme,
  addCustomTheme,
}): React.ReactElement => {
  const [naming, setNaming] = useLinkedState(colorData?.naming);
  const [renaming, setRenaming] = React.useState(false);
  const isDefault = !!colorData?.palette && isDefaultColor(colorData.palette[STANDARD_GRADE]);

  const menuOptions: MenuOption<undefined>[] = isDefault
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
          html={
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
            <ColorCircle background={background} colorData={colorData} small={small} selected={selected} onClick={onClick} />
          </ColorWrapper>

          {(naming || renaming) && (
            <AddNamePopper
              value={name}
              isEditing
              onSubmit={(newName) => {
                const theme = {
                  name: newName,
                  standardColor: colorData!.standardColor,
                  palette: colorData!.palette,
                };

                if (renaming) {
                  editCustomTheme?.(theme);
                } else {
                  addCustomTheme?.(theme);
                }

                setNaming(false);
                setRenaming(false);
              }}
            />
          )}
        </TippyTooltip>
      )}
    </ContextMenu>
  );
};

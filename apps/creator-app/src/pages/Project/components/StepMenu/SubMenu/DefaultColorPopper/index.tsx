import * as Realtime from '@voiceflow/realtime-sdk';
import { COLOR_PICKER_CONSTANTS, ColorPicker, Portal, SvgIcon, usePopper } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

import * as S from '../styles';

interface StepMenuSubMenuDefaultColorPopperProps {
  blockType: Realtime.BlockType;
  isHovered: boolean;
}

const StepMenuSubMenuDefaultColorPopper: React.ForwardRefRenderFunction<HTMLDivElement, StepMenuSubMenuDefaultColorPopperProps> = (
  { blockType, isHovered },
  ref
) => {
  const stepTypeColor = useSelector(VersionV2.active.defaultStepColorByStepType, {
    stepType: blockType,
  });
  const patchDefaultStepColors = useDispatch(Version.patchDefaultStepColors);

  const popper = usePopper({
    modifiers: [
      { name: 'offset', options: { offset: [-12, 25] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
    placement: 'right-start',
  });

  return (
    <div ref={ref}>
      <S.ContextMenuOption ref={popper.setReferenceElement} isActive={isHovered}>
        Default color
        <SvgIcon icon="arrowRight" color="#6E849A" size={10} />
      </S.ContextMenuOption>

      {isHovered && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={popper.styles.popper} {...popper.attributes.popper}>
            <ColorPicker
              defaultColorScheme={COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT}
              onChange={(color) =>
                patchDefaultStepColors({
                  [blockType]: color,
                })
              }
              selectedColor={stepTypeColor || ''}
              debounceTime={300}
            />
          </div>
        </Portal>
      )}
    </div>
  );
};

export default React.forwardRef<HTMLDivElement, StepMenuSubMenuDefaultColorPopperProps>(StepMenuSubMenuDefaultColorPopper);

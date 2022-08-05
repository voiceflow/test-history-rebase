import { Nullable } from '@voiceflow/common';
import {
  ButtonVariant,
  COLOR_PICKER_CONSTANTS,
  ColorThemes,
  normalizeColor,
  PopperAPI,
  PopperPlacement,
  Portal,
  stopPropagation,
  StrictPopperModifiers,
  useDebouncedCallback,
  useLinkedState,
  usePopper,
  VirtualElement,
} from '@voiceflow/ui';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';

import * as S from './styles';

export interface TemplateLibraryPopperProps {
  selectedColor: string;
  onChange: (color: string) => void;
  defaultColorScheme: COLOR_PICKER_CONSTANTS.ColorScheme;
  modifiers?: StrictPopperModifiers;
  placement?: PopperPlacement;
  popperContainerRef?: React.Ref<HTMLDivElement>;
}

export interface TemplateLibraryPopperRef extends PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>> {}

export const TemplateLibraryPopper = React.forwardRef<TemplateLibraryPopperRef, TemplateLibraryPopperProps>(
  ({ selectedColor, onChange, defaultColorScheme, modifiers = [], placement = 'bottom', popperContainerRef, ...props }, ref) => {
    const customThemes = useSelector(ProjectV2.active.customThemesSelector);
    const colors = [COLOR_PICKER_CONSTANTS.DEFAULT_SCHEME_COLORS[defaultColorScheme], ...COLOR_PICKER_CONSTANTS.DEFAULT_THEMES, ...customThemes];
    const normalizedColor = React.useMemo(() => normalizeColor(selectedColor), [selectedColor]);
    const [selectedHex, setSelectedHex] = useLinkedState(normalizedColor);
    const [name, setName] = React.useState<string>('');

    const rootPopper = usePopper({
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }, { name: 'preventOverflow', options: { boundary: document.body } }, ...modifiers],
      strategy: 'fixed',
      placement,
    });

    React.useImperativeHandle(ref, () => rootPopper, [rootPopper]);

    const debouncedOnChange = useDebouncedCallback(100, (color: string) => onChange(color), []);
    const onChangeHex = (hex: string) => {
      setSelectedHex(hex);
      debouncedOnChange(hex);
    };

    const onCreateTemplate = () => {
      // TODO: connect to CRUD actions
      // TODO: dismiss this popper
    };

    return (
      <div ref={rootPopper.setReferenceElement}>
        <Portal portalNode={document.body}>
          <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
            <div ref={popperContainerRef}>
              <S.OuterPopperContent onClick={stopPropagation(null, true)}>
                <S.InnerPopperContent>
                  <S.StyledInput
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    autoSelectText
                    value={name}
                    placeholder="Template Name"
                    onChangeText={setName}
                  />
                  <S.Label>Block Color</S.Label>
                  <ColorThemes {...props} colors={colors} selectedColor={selectedHex} newColorIndex={undefined} onColorSelect={onChangeHex} />
                </S.InnerPopperContent>

                <S.StyledButton variant={ButtonVariant.PRIMARY} onClick={onCreateTemplate} disabled={name.length === 0}>
                  Create
                </S.StyledButton>
              </S.OuterPopperContent>
            </div>
          </div>
        </Portal>
      </div>
    );
  }
);

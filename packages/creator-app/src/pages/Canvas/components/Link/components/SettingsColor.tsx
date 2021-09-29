import { Box, Portal, stopPropagation, usePopper } from '@voiceflow/ui';
import { parseToRgb, toColorString } from 'polished';
import React from 'react';

import ColorPicker from '@/components/ColorPicker';

import Button from './SettingsButton';
import ColorIcon from './SettingsColorIcon';
import ColorsContainer from './SettingsColorsContainer';
import ColorSelected from './SettingsColorSelected';
import Content from './SettingsContent';

const COLORS = ['#8da2b5', '#6297fc', '#5271ff', '#00b76d', '#f83f55', '#ffa626', '#ff7043', '#057571', '#002b47'];

interface SettingsColorProps {
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (color: string) => void;
  isPickerOpen: boolean;
  onPickerToggle: () => void;
  onPickerChange: (color: string) => void;
}

const SettingsColor: React.FC<SettingsColorProps> = ({ color, isOpen, onToggle, onChange, isPickerOpen, onPickerToggle, onPickerChange }) => {
  const rgbColor = parseToRgb(color);

  const rootPopper = usePopper({
    placement: 'bottom',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
  });

  const pickerPopper = usePopper({
    placement: 'right-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 10] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
  });

  return (
    <>
      <Button ref={rootPopper.setReferenceElement} isActive={isOpen} onClick={onToggle} tooltipTitle="Color">
        <ColorIcon color={color} gradient="conic-gradient(gold, orange, red, purple, MediumTurquoise, GreenYellow, gold)" />
      </Button>

      {isOpen && (
        <Portal portalNode={document.body}>
          <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
            <Content onClick={stopPropagation(null, true)}>
              <ColorsContainer>
                {COLORS.map((item) => (
                  <Box key={item} m={8} position="relative">
                    <ColorIcon color={item} isSimple onClick={() => onChange(item)} />
                    {item === color && <ColorSelected />}
                  </Box>
                ))}

                <Box m={8} ref={pickerPopper.setReferenceElement} onClick={onPickerToggle} position="relative">
                  <ColorIcon gradient="conic-gradient(red, gold, lime, aqua, blue, magenta, red)" />
                  {!COLORS.includes(color) && <ColorSelected />}
                </Box>

                {isPickerOpen && (
                  <Portal portalNode={document.body}>
                    <div ref={pickerPopper.setPopperElement} style={pickerPopper.styles.popper} {...pickerPopper.attributes.popper}>
                      <Content onClick={stopPropagation(null, true)}>
                        <ColorPicker
                          width={214}
                          color={{ r: rgbColor.red, g: rgbColor.green, b: rgbColor.blue, a: 1 }}
                          colors={false}
                          onChange={(rgb) => onPickerChange(toColorString({ red: rgb.r, green: rgb.g, blue: rgb.b }))}
                          alphaSlider={false}
                        />
                      </Content>
                    </div>
                  </Portal>
                )}
              </ColorsContainer>
            </Content>
          </div>
        </Portal>
      )}
    </>
  );
};

export default SettingsColor;

import { parseToRgb, toColorString } from 'polished';
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import Box from '@/components/Box';
import ColorPicker from '@/components/ColorPicker';
import Portal from '@/components/Portal';
import { stopPropagation } from '@/utils/dom';

import Button from './SettingsButton';
import ColorIcon from './SettingsColorIcon';
import ColorsContainer from './SettingsColorsContainer';
import ColorSelected from './SettingsColorSelected';
import Content from './SettingsContent';

const COLORS = ['#8da2b5', '#6297fc', '#5271ff', '#00b76d', '#f83f55', '#ffa626', '#ff7043', '#057571', '#002b47'];

type SettingsColorProps = {
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (color: string) => void;
  isPickerOpen: boolean;
  onPickerToggle: () => void;
  onPickerChange: (color: string) => void;
};

const SettingsColor: React.FC<SettingsColorProps> = ({ color, isOpen, onToggle, onChange, isPickerOpen, onPickerToggle, onPickerChange }) => {
  const rgbColor = parseToRgb(color);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Button ref={ref} isActive={isOpen} onClick={onToggle} tooltipTitle="Color">
            <ColorIcon color={color} gradient="conic-gradient(gold, orange, red, purple, MediumTurquoise, GreenYellow, gold)" />
          </Button>
        )}
      </Reference>

      {isOpen && (
        <Portal portalNode={document.body}>
          <Popper placement="bottom" modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }} positionFixed>
            {({ ref, style }) => (
              <div ref={ref} style={style}>
                <Content onClick={stopPropagation(null, true)}>
                  <ColorsContainer>
                    {COLORS.map((item) => (
                      <Box key={item} m={8} position="relative">
                        <ColorIcon color={item} isSimple onClick={() => onChange(item)} />
                        {item === color && <ColorSelected />}
                      </Box>
                    ))}

                    <Manager>
                      <Reference>
                        {({ ref }) => (
                          <Box m={8} ref={ref} onClick={onPickerToggle} position="relative">
                            <ColorIcon gradient="conic-gradient(red, gold, lime, aqua, blue, magenta, red)" />
                            {!COLORS.includes(color) && <ColorSelected />}
                          </Box>
                        )}
                      </Reference>

                      {isPickerOpen && (
                        <Portal portalNode={document.body}>
                          <Popper
                            placement="right-start"
                            modifiers={{ offset: { offset: '0,10' }, preventOverflow: { boundariesElement: document.body } }}
                            positionFixed
                          >
                            {({ ref, style }) => (
                              <div ref={ref} style={style}>
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
                            )}
                          </Popper>
                        </Portal>
                      )}
                    </Manager>
                  </ColorsContainer>
                </Content>
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default SettingsColor;

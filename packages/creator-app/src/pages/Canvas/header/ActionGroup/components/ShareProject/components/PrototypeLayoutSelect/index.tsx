import { Box, Menu, MenuItem } from '@voiceflow/ui';
import React from 'react';

import CheckBox from '@/components/Checkbox/';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import { PrototypeLayout } from '@/constants/prototype';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';
import { PlatformContext } from '@/pages/Project/contexts';
import { ClassName } from '@/styles/constants';

import PrototypeLayoutItem from '../PrototypeLayoutItem';
import { CUSTOM_MENU_WIDTH, getLayoutOptions, OPTION_DETAILS } from './constants';

const PrototypeLayoutSelect: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  const layout = useSelector(Prototype.prototypeLayoutSelector);
  const updateSettings = useDispatch(Prototype.updateSharePrototypeSettings);
  const buttonsOnly = useSelector(Prototype.prototypeButtonsOnlySelector);

  const [localLayout, setLocalLayout] = useLinkedState(layout);

  const isLayoutTextDialog = layout === PrototypeLayout.TEXT_DIALOG;

  const onClick = (option: PrototypeLayout, cb: () => void) => async () => {
    setLocalLayout(option);
    updateSettings({ layout: option });
    cb();
  };

  const layoutOptions = React.useMemo(() => getLayoutOptions(platform).filter((option) => option !== layout), [layout, platform]);

  const onButtonsOnlyChange = () => {
    updateSettings({ buttonsOnly: !buttonsOnly });
  };

  return (
    <Box pr={32}>
      <DropdownWithCaret
        fullWidth
        menu={(onToggle: () => void) => (
          <Menu width={CUSTOM_MENU_WIDTH}>
            {layoutOptions.map((option: PrototypeLayout) => (
              <MenuItem
                key={option}
                style={{ paddingTop: '12px', paddingBottom: '12px', height: 'auto' }}
                onClick={onClick(option, onToggle)}
                className={ClassName.TEST_TYPE_OPTION}
              >
                <PrototypeLayoutItem
                  src={option === localLayout ? OPTION_DETAILS[option].activeImg : OPTION_DETAILS[option].inactiveImg}
                  title={OPTION_DETAILS[option].title}
                  description={OPTION_DETAILS[option].description(platform)}
                />
              </MenuItem>
            ))}
          </Menu>
        )}
        border="1px solid #d4d9e6"
        placement="bottom-start"
        text={
          <PrototypeLayoutItem
            src={OPTION_DETAILS[localLayout].activeImg}
            title={OPTION_DETAILS[localLayout].title}
            description={OPTION_DETAILS[localLayout].description(platform)}
          />
        }
      />
      <Box pt={isLayoutTextDialog ? 12 : 0} pb={24}>
        {isLayoutTextDialog && (
          <CheckBox checked={buttonsOnly} onChange={onButtonsOnlyChange}>
            <Box color="primary" fontWeight={400}>
              Buttons only
            </Box>
          </CheckBox>
        )}
      </Box>
    </Box>
  );
};

export default PrototypeLayoutSelect;

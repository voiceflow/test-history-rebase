import { Box, Checkbox, Menu } from '@voiceflow/ui';
import React from 'react';

import DropdownWithCaret from '@/components/DropdownWithCaret';
import { PrototypeLayout } from '@/constants/prototype';
import * as Prototype from '@/ducks/prototype';
import { useActiveProjectConfig, useDispatch, useLinkedState, useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { LayoutItem } from './components';
import { CUSTOM_MENU_WIDTH, getLayoutOptions, OPTION_DETAILS } from './constants';

const LayoutSelect: React.FC = () => {
  const { platform, projectType } = useActiveProjectConfig();

  const layout = useSelector(Prototype.prototypeLayoutSelector);
  const buttonsOnly = useSelector(Prototype.prototypeButtonsOnlySelector);

  const updateSettings = useDispatch(Prototype.updateSharePrototypeSettings);

  const [localLayout, setLocalLayout] = useLinkedState(layout);

  const isLayoutTextDialog = layout === PrototypeLayout.TEXT_DIALOG;

  const onClick = (option: PrototypeLayout, cb: () => void) => async () => {
    setLocalLayout(option);
    updateSettings({ layout: option });
    cb();
  };

  const onButtonsOnlyChange = () => {
    updateSettings({ buttonsOnly: !buttonsOnly });
  };

  const layoutOptions = React.useMemo(() => getLayoutOptions(projectType).filter((option) => option !== layout), [layout, projectType]);

  return (
    <Box pr={32}>
      <DropdownWithCaret
        fullWidth
        menu={(onToggle) => (
          <Menu width={CUSTOM_MENU_WIDTH}>
            {layoutOptions.map((option) => (
              <Menu.Item
                key={option}
                style={{ paddingTop: '12px', paddingBottom: '12px', height: 'auto' }}
                onClick={onClick(option, onToggle)}
                className={ClassName.TEST_TYPE_OPTION}
              >
                <LayoutItem
                  src={option === localLayout ? OPTION_DETAILS[option].activeImg : OPTION_DETAILS[option].inactiveImg}
                  title={OPTION_DETAILS[option].title}
                  description={OPTION_DETAILS[option].description(platform)}
                />
              </Menu.Item>
            ))}
          </Menu>
        )}
        border="1px solid #d4d9e6"
        placement="bottom-start"
        text={
          <LayoutItem
            src={OPTION_DETAILS[localLayout].activeImg}
            title={OPTION_DETAILS[localLayout].title}
            description={OPTION_DETAILS[localLayout].description(platform)}
          />
        }
      />

      <Box pt={isLayoutTextDialog ? 12 : 0} pb={24}>
        {isLayoutTextDialog && (
          <Checkbox checked={buttonsOnly} onChange={onButtonsOnlyChange}>
            <Box color="primary" fontWeight={400}>
              Buttons only
            </Box>
          </Checkbox>
        )}
      </Box>
    </Box>
  );
};

export default LayoutSelect;

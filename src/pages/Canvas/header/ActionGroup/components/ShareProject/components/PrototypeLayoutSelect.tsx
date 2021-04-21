import React from 'react';

import { textAndDialogGraphic, textAndDialogGraphicInactive, voiceAndVisualsGraphic, voiceAndVisualsGraphicInactive } from '@/assets';
import Box from '@/components/Box';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import Menu, { MenuItem } from '@/components/Menu';
import * as Prototype from '@/ducks/prototype';
import { PrototypeLayout } from '@/ducks/prototype/types';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import { ConnectedProps } from '@/types';

import PrototypeLayoutItem from './PrototypeLayoutItem';

const OPTION_DETAILS: Record<PrototypeLayout, Record<string, string>> = {
  [PrototypeLayout.TEXT_DIALOG]: {
    title: 'Text and Transcript',
    description: 'Testers will use text and chips input',
    activeImg: textAndDialogGraphic,
    inactiveImg: textAndDialogGraphicInactive,
  },
  [PrototypeLayout.VOICE_DIALOG]: {
    title: 'Voice and Transcript',
    description: 'Testers will use voice and chips input',
    activeImg: textAndDialogGraphic,
    inactiveImg: textAndDialogGraphic,
  },
  [PrototypeLayout.VOICE_VISUALS]: {
    title: 'Voice and Visuals',
    description: 'Testers will only use voice input',
    activeImg: voiceAndVisualsGraphic,
    inactiveImg: voiceAndVisualsGraphicInactive,
  },
};
/**
 *  width is calculated from parent popup width and padding
 * to account for caret
 *  */
const CUSTOM_MENU_WIDTH = 374;

const PrototypeLayoutSelect: React.FC<ConnectedPrototypeLayoutSelectProps> = ({ layout, updateSettings }) => {
  const [localLayout, setLocalLayout] = React.useState(layout);

  const onClick = (option: PrototypeLayout, cb: () => void) => async () => {
    setLocalLayout(option);
    updateSettings({ layout: option });
    cb();
  };

  const getOptions = React.useCallback(
    () => [PrototypeLayout.TEXT_DIALOG, PrototypeLayout.VOICE_DIALOG, PrototypeLayout.VOICE_VISUALS].filter((option) => option !== layout),
    [layout]
  );

  useDidUpdateEffect(() => {
    if (layout !== localLayout) {
      setLocalLayout(layout);
    }
  }, [layout]);

  return (
    <Box pb={24} pr={32}>
      <DropdownWithCaret
        fullWidth
        menu={(onToggle: () => void) => (
          <Menu width={CUSTOM_MENU_WIDTH}>
            {getOptions().map((option: PrototypeLayout) => (
              <MenuItem onClick={onClick(option, onToggle)} key={option} style={{ paddingTop: '12px', paddingBottom: '12px', height: 'auto' }}>
                <PrototypeLayoutItem
                  title={OPTION_DETAILS[option].title}
                  description={OPTION_DETAILS[option].description}
                  src={option === localLayout ? OPTION_DETAILS[option].activeImg : OPTION_DETAILS[option].inactiveImg}
                />
              </MenuItem>
            ))}
          </Menu>
        )}
        border="1px solid #d4d9e6"
        placement="bottom-start"
        autoDismiss
        text={
          <PrototypeLayoutItem
            src={OPTION_DETAILS[localLayout].activeImg}
            title={OPTION_DETAILS[localLayout].title}
            description={OPTION_DETAILS[localLayout].description}
          />
        }
      />
    </Box>
  );
};

const mapStateToProps = {
  layout: Prototype.prototypeLayoutSelector,
};

const mapDispatchToProps = {
  updateSettings: Prototype.updateSharePrototypeSettings,
};

export type ConnectedPrototypeLayoutSelectProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeLayoutSelect);

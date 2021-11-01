import { Box, Menu, MenuItem, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import DropdownWithCaret from '@/components/DropdownWithCaret';
import * as Prototype from '@/ducks/prototype';
import { PrototypeLayout } from '@/ducks/prototype/types';
import { connect } from '@/hocs';
import { PlatformContext } from '@/pages/Project/contexts';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import PrototypeLayoutItem from '../PrototypeLayoutItem';
import { CUSTOM_MENU_WIDTH, getLayoutOptions, OPTION_DETAILS } from './constants';

const PrototypeLayoutSelect: React.FC<ConnectedPrototypeLayoutSelectProps> = ({ layout, updateSettings }) => {
  const platform = React.useContext(PlatformContext)!;
  const [localLayout, setLocalLayout] = React.useState(layout);

  const onClick = (option: PrototypeLayout, cb: () => void) => async () => {
    setLocalLayout(option);
    updateSettings({ layout: option });
    cb();
  };

  const layoutOptions = React.useMemo(() => {
    const options = getLayoutOptions(platform);
    return options.filter((option) => option !== layout);
  }, [layout, platform]);

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
            {layoutOptions.map((option: PrototypeLayout) => (
              <MenuItem
                className={ClassName.TEST_TYPE_OPTION}
                onClick={onClick(option, onToggle)}
                key={option}
                style={{ paddingTop: '12px', paddingBottom: '12px', height: 'auto' }}
              >
                <PrototypeLayoutItem
                  title={OPTION_DETAILS[option].title}
                  description={OPTION_DETAILS[option].description(platform)}
                  src={option === localLayout ? OPTION_DETAILS[option].activeImg : OPTION_DETAILS[option].inactiveImg}
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

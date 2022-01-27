import { ClickableText, Icon, Input, NestedInputIconPosition } from '@voiceflow/ui';
import React, { useCallback, useMemo, useState } from 'react';

import Divider from '@/components/Divider';
import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { Permission } from '@/config/permissions';
import { ModalType, RESPONSE_COLOR_CODES as COLOR_CODES } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import THEME from '@/styles/theme';
import { ConnectedProps } from '@/types';

import { StyledBlockText } from './components';

interface PrototypePasswordInputProps {
  dividers?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const UnconnectedPrototypePasswordInput: React.FC<PrototypePasswordInputProps & ConnectedPrototypePasswordInputProps> = ({
  dividers = true,
  isCollapsed,
  initialValue = '',
  updateSettings,
  onToggleCollapse,
}) => {
  // Internal UI state for rendering only
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocus] = useState(false);

  const onFocus = useCallback(() => setIsFocus(true), [setIsFocus]);

  // Passes back the final value of the input to higher-level component
  const onBlur = useCallback(
    (event) => {
      setIsFocus(false);
      updateSettings({
        password: event.target.value,
      });
    },
    [setIsFocus, updateSettings]
  );

  const [canAccessPassword] = usePermission(Permission.SHARE_PROTOTYPE_PASSWORD);

  const upgradeModal = useModals(ModalType.PAYMENT);

  const onClickUpgrade = useCallback(() => upgradeModal.open(), [upgradeModal]);

  const iconProps = useMemo(
    () => ({
      iconPosition: !isFocused && initialValue.length ? NestedInputIconPosition.RIGHT : NestedInputIconPosition.NONE,
      icon: 'check2' as Icon,
      iconProps: {
        color: COLOR_CODES.GREEN,
      },
    }),
    [isFocused, initialValue]
  );

  const inputWrapperProps = useMemo(
    () =>
      canAccessPassword
        ? {}
        : {
            pointerEvents: 'auto',
            cursor: 'not-allowed',
          },
    [canAccessPassword]
  );

  return (
    <>
      <UncontrolledSection
        isCollapsed={isCollapsed}
        onClick={onToggleCollapse}
        header="Password Protection"
        dividers={dividers}
        isDividerNested
        collapseVariant={SectionToggleVariant.ARROW}
        variant={SectionVariant.PRIMARY}
        customContentStyling={{ marginBottom: isCollapsed ? 0 : 24 }}
      >
        <Input
          {...iconProps}
          value={value}
          nested
          onBlur={onBlur}
          disabled={!canAccessPassword}
          placeholder="Add password"
          onChangeText={setValue}
          wrapperProps={inputWrapperProps}
          onFocusOnClick={onFocus}
        />

        {!canAccessPassword && (
          <StyledBlockText fontSize={13} color={THEME.colors.secondary} paddingTop={16}>
            <span>Unlock password protected prototypes. </span>
            <ClickableText onClick={onClickUpgrade}>Upgrade</ClickableText>
          </StyledBlockText>
        )}
      </UncontrolledSection>

      {isCollapsed && <Divider offset={0} style={{ width: 'calc(100% - 32px)', marginLeft: '32px' }} isSecondaryColor />}
    </>
  );
};

const mapStateToProps = {
  initialValue: Prototype.prototypePasswordSelector,
};

const mapDispatchToProps = {
  updateSettings: Prototype.updateSharePrototypeSettings,
};

type ConnectedPrototypePasswordInputProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedPrototypePasswordInput) as React.FC<PrototypePasswordInputProps>;

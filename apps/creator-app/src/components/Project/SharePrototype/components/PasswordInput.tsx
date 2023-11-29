import { BlockText, Divider, Input, NestedInputIconPosition, System } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { RESPONSE_COLOR_CODES as COLOR_CODES } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import THEME from '@/styles/theme';

interface PasswordInputProps {
  dividers?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ dividers = true, isCollapsed, onToggleCollapse }) => {
  const initialValue = useSelector(Prototype.prototypePasswordSelector);
  const updateSettings = useDispatch(Prototype.updateSharePrototypeSettings);

  // Internal UI state for rendering only
  const [value, setValue] = useLinkedState(initialValue);
  const [isFocused, toggleIsFocused] = useToggle(false);

  const paymentModal = usePaymentModal();
  const [canAccessPassword] = usePermission(Permission.SHARE_PROTOTYPE_PASSWORD);

  const onFocus = () => toggleIsFocused(true);

  // Passes back the final value of the input to higher-level component
  const onBlur = () => {
    toggleIsFocused(false);
    updateSettings({ password: value });
  };

  return (
    <>
      <UncontrolledSection
        header="Password Protection"
        variant={SectionVariant.PRIMARY}
        onClick={onToggleCollapse}
        dividers={dividers}
        isCollapsed={isCollapsed}
        isDividerNested
        collapseVariant={SectionToggleVariant.ARROW}
        customContentStyling={{ marginBottom: isCollapsed ? 0 : 24 }}
      >
        <Input
          icon="check2"
          value={value}
          nested
          onBlur={onBlur}
          cursor={canAccessPassword ? undefined : 'not-allowed'}
          disabled={!canAccessPassword}
          iconProps={{ color: COLOR_CODES.GREEN }}
          placeholder="Add password"
          onChangeText={setValue}
          iconPosition={!isFocused && initialValue.length ? NestedInputIconPosition.RIGHT : NestedInputIconPosition.NONE}
          wrapperProps={canAccessPassword ? {} : { pointerEvents: 'auto' }}
          onFocusOnClick={onFocus}
        />

        {!canAccessPassword && (
          <BlockText fontSize={13} color={THEME.colors.secondary} paddingTop={16}>
            <span>Unlock password protected prototypes. </span>

            <System.Link.Button onClick={() => paymentModal.openVoid({})}>Upgrade</System.Link.Button>
          </BlockText>
        )}
      </UncontrolledSection>

      {isCollapsed && <Divider offset={0} style={{ width: 'calc(100% - 32px)', marginLeft: '32px' }} isSecondaryColor />}
    </>
  );
};

export default PasswordInput;

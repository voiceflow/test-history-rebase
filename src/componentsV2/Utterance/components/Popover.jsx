import React from 'react';

import Button from '@/components/Button';
import Input from '@/componentsV2/Input';
import { MenuContainer } from '@/componentsV2/Menu';
import { css, styled } from '@/hocs';
import { FadeDownContainer } from '@/styles/animations';
import { preventDefault, withKeyPress } from '@/utils/dom';

const PopoverContainer = styled.div`
  z-index: 50;
  position: absolute;
`;

const Header = styled.div`
  ${({ focused }) =>
    focused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;

      > input {
        background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
      }
    `}

  display: flex;
  padding: 0 24px;
`;

const StyledInput = styled(Input)`
  padding: 12px 0;
  flex: 1;
`;

const Hr = styled.hr`
  margin: 0;
`;

// eslint-disable-next-line react/display-name
export default React.forwardRef(
  ({ isFocused, slotsMap, children, slotName, onHover, onFocusInput, onBlurInput, onChangeSlotName, onCreateMention }, ref) => {
    return (
      <PopoverContainer ref={ref}>
        <MenuContainer>
          <FadeDownContainer>
            <Header focused={isFocused} onMouseEnter={onHover}>
              <StyledInput
                value={slotName}
                onBlur={onBlurInput}
                variant="inline"
                onChange={onChangeSlotName}
                onKeyPress={withKeyPress(13, onCreateMention)}
                placeholder="New Slot"
                onMouseDown={onFocusInput}
              />

              <Button
                isBtn
                onClick={onCreateMention}
                disabled={!slotName || !!slotsMap[slotName]}
                className="pointer"
                isLinkLarge
                onMouseDown={preventDefault()}
              >
                Create
              </Button>
            </Header>

            <Hr />

            {children}
          </FadeDownContainer>
        </MenuContainer>
      </PopoverContainer>
    );
  }
);

import React from 'react';

import Input from '@/components/Input';
import Button from '@/components/LegacyButton';
import { MenuContainer } from '@/components/Menu';
import Portal from '@/components/Portal';
import { css, styled } from '@/hocs';
import { FadeDownContainer } from '@/styles/animations';
import { preventDefault, stopPropagation, withKeyPress } from '@/utils/dom';

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
  (
    {
      onHover,
      children,
      isFocused,
      creatable,
      placeholder = 'New Variable',
      onBlurInput,
      variablesMap,
      variableName,
      onFocusInput,
      onCreateMention,
      onChangeVariableName,
    },
    ref
  ) => {
    return (
      <Portal portalNode={document.body}>
        <PopoverContainer ref={ref} onClick={stopPropagation()}>
          <MenuContainer onBlur={creatable ? onBlurInput : undefined}>
            <FadeDownContainer>
              {creatable && (
                <>
                  <Header focused={isFocused} onMouseEnter={onHover}>
                    <StyledInput
                      value={variableName}
                      variant="inline"
                      onChange={onChangeVariableName}
                      onKeyPress={withKeyPress(13, onCreateMention)}
                      placeholder={placeholder}
                      onMouseDown={onFocusInput}
                    />

                    <Button
                      isBtn
                      onClick={preventDefault(onCreateMention)}
                      disabled={!variableName || !!variablesMap[variableName]}
                      className="pointer"
                      isLinkLarge
                      onMouseDown={preventDefault()}
                    >
                      Create
                    </Button>
                  </Header>

                  <Hr />
                </>
              )}

              {children}
            </FadeDownContainer>
          </MenuContainer>
        </PopoverContainer>
      </Portal>
    );
  }
);

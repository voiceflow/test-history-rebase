import { Input, Link, Menu, Portal, preventDefault, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { TextEditorVariablesPopoverConsumer } from '@/contexts';
import { css, styled } from '@/hocs';
import { FadeDownDelayedContainer } from '@/styles/animations';

const PopoverContainer = styled.div`
  z-index: ${({ theme }) => theme.zIndex.popper};
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

  align-items: center;
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
  ) => (
    <TextEditorVariablesPopoverConsumer>
      {(portalNode) => (
        <Portal portalNode={portalNode}>
          <PopoverContainer ref={ref} onClick={stopPropagation()}>
            <Menu.Container onBlur={creatable ? onBlurInput : undefined}>
              <FadeDownDelayedContainer>
                {creatable && (
                  <>
                    <Header focused={isFocused} onMouseEnter={onHover}>
                      <StyledInput
                        value={variableName}
                        variant="inline"
                        onChange={onChangeVariableName}
                        placeholder={placeholder}
                        onMouseDown={onFocusInput}
                        onEnterPress={onCreateMention}
                      />

                      <Link
                        textDecoration
                        onClick={preventDefault(onCreateMention)}
                        disabled={!variableName || !!variablesMap[variableName]}
                        className="pointer"
                        onMouseDown={preventDefault()}
                      >
                        Create
                      </Link>
                    </Header>

                    <Hr />
                  </>
                )}

                {children}
              </FadeDownDelayedContainer>
            </Menu.Container>
          </PopoverContainer>
        </Portal>
      )}
    </TextEditorVariablesPopoverConsumer>
  )
);

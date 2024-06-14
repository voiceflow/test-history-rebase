import { Utils } from '@voiceflow/common';
import { Animations, Box, Input, Menu, Portal, preventDefault, stopPropagation, SvgIcon, System } from '@voiceflow/ui';
import React from 'react';

import { TextEditorVariablesPopoverConsumer } from '@/contexts/TextEditorVariablesPopoverContext';
import { styled } from '@/hocs/styled';

const PopoverContainer = styled.div`
  z-index: ${({ theme }) => theme.zIndex.popper};
  position: absolute;
`;

const Header = styled.div`
  align-items: center;
  display: flex;
  padding: 0 24px;
`;

const StyledInput = styled(Input)`
  padding: 10px 0;
  line-height: 20px;
`;

const Hr = styled.hr`
  margin: 5px 0;
`;

const Content = styled.div`
  max-height: ${({ theme }) => Menu.getMaxHeight(undefined, 6.5, theme.components.menuItem.height)};
  overflow-y: auto;
`;

export default React.forwardRef(
  (
    {
      isEmpty,
      onHover,
      children,
      creatable,
      placeholder = 'Search variables',
      searchValue,
      onBlurInput,
      variablesMap,
      variableName,
      onFocusInput,
      notExistMessage,
      notFoundMessage,
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
              <Animations.FadeDownDelayed>
                <Header onMouseEnter={onHover}>
                  <Box mr={12} display="inline-block">
                    <SvgIcon icon="search" size={16} color="#6E849A" />
                  </Box>

                  <StyledInput
                    value={variableName}
                    variant="inline"
                    onChange={({ target }) => onChangeVariableName({ value: target.value })}
                    placeholder={placeholder}
                    onMouseDown={onFocusInput}
                    onEnterPress={onCreateMention}
                  />

                  {creatable && (
                    <System.IconButtonsGroup.Base>
                      <System.IconButton.Base
                        icon="plus"
                        onClick={Utils.functional.chainVoid(preventDefault, onCreateMention)}
                        disabled={!variableName || !!variablesMap[variableName]}
                        onMouseDown={preventDefault()}
                      />
                    </System.IconButtonsGroup.Base>
                  )}
                </Header>

                <Hr />

                <Content>
                  {isEmpty ? (
                    <Menu.Item readOnly>
                      <Menu.NotFound>
                        {!searchValue ? notExistMessage ?? 'No items exist.' : notFoundMessage ?? 'Nothing found'}
                      </Menu.NotFound>
                    </Menu.Item>
                  ) : (
                    children
                  )}
                </Content>
              </Animations.FadeDownDelayed>
            </Menu.Container>
          </PopoverContainer>
        </Portal>
      )}
    </TextEditorVariablesPopoverConsumer>
  )
);

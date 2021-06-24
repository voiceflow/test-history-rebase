import { FlexCenter, SvgIconContainer } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export type MenuItemProps = {
  selected?: boolean;
};

export const ITEM_HEIGHT = 44;
export const ITEM_MARGIN_VERTICAL = 14;

const MenuItem = styled(FlexCenter)<MenuItemProps>`
  width: 100%;
  height: ${ITEM_HEIGHT}px;
  margin: ${ITEM_MARGIN_VERTICAL}px 0;
  padding: 14px 0;
  flex-wrap: wrap;
  cursor: pointer;
  border-right: 2px solid transparent;

  ${({ selected }) =>
    selected &&
    css`
      cursor: default;
      pointer-events: none;
    `}

  &:hover {
    ${SvgIconContainer} {
      color: ${({ theme }) => theme.colors.quaternary};
    }
  }
`;

export default MenuItem;

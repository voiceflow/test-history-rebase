import { flexCenterStyles } from '@/components/Flex';
import { css, styled } from '@/hocs';

import { HEADER_HEIGHT } from '../../../constants';

type HeaderContainerProps = {
  hasIcon: boolean;
};

const HeaderContainer = styled.div<HeaderContainerProps>`
  ${flexCenterStyles};
  height: ${HEADER_HEIGHT}px;
  text-overflow: ellipsis;

  ${({ hasIcon }) =>
    hasIcon &&
    css`
      padding: 0 42px;
    `};
`;

export default HeaderContainer;

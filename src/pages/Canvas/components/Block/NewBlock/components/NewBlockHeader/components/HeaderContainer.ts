import { flexCenterStyles } from '@/components/Flex';
import { css, styled } from '@/hocs';

type HeaderContainerProps = {
  hasIcon: boolean;
};

const HeaderContainer = styled.div<HeaderContainerProps>`
  ${flexCenterStyles};
  height: 54px;
  text-overflow: ellipsis;
  ${({ hasIcon }) =>
    hasIcon &&
    css`
      padding: 0 42px;
    `};
`;

export default HeaderContainer;

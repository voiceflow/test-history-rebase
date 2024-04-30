import Flex, { FlexCenter } from '@/components/Flex';
import { css, styled, transition } from '@/styles';

const Footer = styled(Flex)<{ noItems?: boolean }>`
  height: 68px;
  width: 100%;

  ${({ theme, noItems }) =>
    noItems
      ? css`
          margin-top: -8px;
        `
      : css`
          margin-top: 8px;
          border-top: 1px solid ${theme.colors.separatorSecondary};
        `}
`;

const Action = styled(FlexCenter)<{ disabled?: boolean; borderLeftStyle?: boolean }>`
  ${transition('color', 'background-color')};

  flex: 1;
  height: 100%;
  padding: 20px 24px;
  cursor: pointer;
  color: #3d82e2;
  background-color: #fdfdfd;

  ${({ borderLeftStyle = true }) =>
    borderLeftStyle &&
    css`
      &:not(:first-child) {
        border-left: 1px solid ${({ theme }) => theme.colors.separatorSecondary};
      }
    `}

  &:hover {
    color: #3876cb;
    background-color: #fbfbfb;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      color: rgba(61, 130, 226, 0.5);
    `}
`;

export default Object.assign(Footer, { Action });

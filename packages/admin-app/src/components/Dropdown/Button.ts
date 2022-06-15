import { Box, SvgIcon, transition } from '@voiceflow/ui';

import { css, styled } from '@/styles';

const Button = styled(Box.Flex)<{ isOpen: boolean; noBorder: boolean }>`
  ${transition()};
  color: ${({ isOpen }) => (isOpen ? '#5d9df5' : '#132042')};
  font-size: 15px;
  cursor: pointer;

  ${({ noBorder = false }) =>
    !noBorder &&
    css`
      padding: 10px 16px;
      background: #fff;
      border: 1px solid #d2dae2;
      border-radius: 5px;
      box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
    `}

  ${SvgIcon.Container} {
    display: inline-block;
    margin-left: 5px;
    color: ${({ isOpen }) => (isOpen ? '#5d9df5' : '#62778c')};
  }
`;

export default Button;

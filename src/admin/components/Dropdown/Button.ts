import { Flex } from '@/components/Box';
import * as SvgIcon from '@/components/SvgIcon';
import { css, styled, transition } from '@/hocs';

const Button = styled(Flex)<{ isOpen: boolean; noBorder: boolean }>`
  ${transition()};
  cursor: pointer;
  font-size: 15px;

  color: ${({ isOpen }) => (isOpen ? '#5d9df5' : '#132042')};

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

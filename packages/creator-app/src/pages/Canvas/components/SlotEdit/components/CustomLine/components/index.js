import Flex from '@/components/Flex';
import * as SvgIcon from '@/components/SvgIcon';
import { css, styled } from '@/hocs';

export const ValueContainer = styled.div`
  flex: 1;
`;

export const SynonymContainer = styled.div`
  flex: 2;
  padding: 0 10px;
`;

export const ButtonContainer = styled.div`
  border-radius: 50%;
  width: 17px;
  height: 17px;
  padding: 3px;
  display: inline-block;
  cursor: pointer;
  transition: all 0.1s linear;
  opacity: 0.85;
  background-color: #6e849a;

  ${SvgIcon.Container} {
    color: white;
  }

  :hover {
    opacity: 1;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
      pointer-events: none;
      background-color: #d4d9e6;
    `}
`;

export const Container = styled(Flex)`
  margin-bottom: 10px;
`;

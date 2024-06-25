import { FlexCenter } from '@ui/components/Flex';
import { styled } from '@ui/styles';

export const RemoveButton = styled(FlexCenter)<{ top?: number; right?: number }>`
  cursor: pointer;
  position: absolute;

  top: ${({ top = 10 }) => `${top}px`};
  right: ${({ right = 10 }) => `${right}px`};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: white;
  box-shadow:
    0px 2px 4px rgba(17, 49, 96, 0.16),
    0px 0px 0px rgba(17, 49, 96, 0.04);
  z-index: 10;
`;

export const ErrorText = styled.span`
  color: red;
  font-weight: 600;
`;

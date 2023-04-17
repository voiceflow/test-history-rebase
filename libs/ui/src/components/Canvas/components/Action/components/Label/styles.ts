import Box from '@ui/components/Box';
import { styled, transition } from '@ui/styles';

export const Container = styled(Box.Flex)<{ secondary?: boolean }>`
  ${transition('color')}
  color: ${({ theme, secondary }) => (secondary ? theme.colors.tertiary : theme.colors.secondary)};
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  white-space: nowrap;
  max-width: 200px;
`;

export const LeftPart = styled.div`
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RightPart = styled.div``;

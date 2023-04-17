import { BoxProps, boxStyles } from '@ui/components/Box';
import { flexCenterStyles, FlexProps } from '@ui/components/Flex';
import { styled } from '@ui/styles';

export interface ContainerProps extends Omit<BoxProps, 'alignItems'>, FlexProps {}

export const Container = styled.div<ContainerProps>`
  ${flexCenterStyles};
  ${boxStyles};
`;

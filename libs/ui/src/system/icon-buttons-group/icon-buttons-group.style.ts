import type { BoxProps } from '@ui/components/Box';
import { boxStyles } from '@ui/components/Box';
import type { FlexProps } from '@ui/components/Flex';
import { flexCenterStyles } from '@ui/components/Flex';
import { styled } from '@ui/styles';

export interface ContainerProps extends Omit<BoxProps, 'alignItems'>, FlexProps {}

export const Container = styled.div<ContainerProps>`
  ${flexCenterStyles};
  ${boxStyles};
`;

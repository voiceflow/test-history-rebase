import type { BoxProps } from '@/components/Box';
import { boxStyles } from '@/components/Box';
import type { FlexProps } from '@/components/Flex';
import { flexCenterStyles } from '@/components/Flex';
import { styled } from '@/styles';

export interface ContainerProps extends Omit<BoxProps, 'alignItems'>, FlexProps {}

export const Container = styled.div<ContainerProps>`
  ${flexCenterStyles};
  ${boxStyles};
`;

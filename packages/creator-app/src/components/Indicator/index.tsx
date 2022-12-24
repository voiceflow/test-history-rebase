import { styled, transition } from '@/hocs/styled';

export interface IndicatorPseudoElemProps<T extends string = string> {
  size: number;
  variant: T;
  borderColorMap: Record<T, string>;
  bgGradientMap: Record<T, string>;
}

export const StatusIndicator = styled.div<IndicatorPseudoElemProps>`
  ${transition('transform')}

  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: ${({ variant, borderColorMap }) => borderColorMap[variant]} solid 1px;
  border-radius: 50%;
  background-color: ${({ variant, bgGradientMap }) => bgGradientMap[variant]};
  box-shadow: 0 1px 0 0 rgba(17, 49, 96, 0.08);
`;

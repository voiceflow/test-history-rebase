import { styled } from '@/hocs';

// eslint-disable-next-line import/prefer-default-export
export const VariableLabel = styled.span`
  color: ${({ theme }) => theme.components.step.labelText.variants.primary};
`;

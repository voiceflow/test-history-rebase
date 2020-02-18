import { styled } from '@/hocs';

const VariableLabel = styled.span`
  color: ${({ theme }) => theme.components.step.labelText.variants.primary};
`;

export default VariableLabel;

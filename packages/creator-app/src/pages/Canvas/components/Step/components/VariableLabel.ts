import { styled } from '@/hocs/styled';

const VariableLabel = styled.span`
  color: ${({ theme }) => theme.components.blockStep.labelText.variants.primary};
`;

export default VariableLabel;

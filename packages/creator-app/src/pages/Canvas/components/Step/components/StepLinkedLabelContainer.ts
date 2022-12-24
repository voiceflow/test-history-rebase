import { styled } from '@/hocs/styled';

const StepLinkedLabelContainer = styled.div`
  display: flex;
  margin-top: 3px;

  color: ${({ theme }) => theme.colors.secondary};
  font-size: 13px;
`;

export default StepLinkedLabelContainer;

import { styled } from '@/hocs';

const StepSection = styled.div`
  background-color: ${(props) => (props.secondary ? props.theme.color.offWhite : 'none')};
  border-bottom: ${(props) => (props.secondary ? '1px solid #eaeff4' : 'none')};
  border-top: ${(props) => (props.secondary ? '1px solid #eaeff4' : 'none')};
  padding: ${(props) => (props.secondary ? '15px 32px' : '0 32px 12px 32px')};
`;

export default StepSection;

import { styled } from '@/hocs/styled';

interface StepSectionProps {
  secondary?: boolean;
}

const StepSection = styled.div<StepSectionProps>`
  background-color: ${(props) => (props.secondary ? props.theme.backgrounds.offWhiteBlue : 'none')};
  border-bottom: ${(props) => (props.secondary ? '1px solid #eaeff4' : 'none')};
  border-top: ${(props) => (props.secondary ? '1px solid #eaeff4' : 'none')};
  padding: ${(props) => (props.secondary ? '15px 32px' : '0 32px 12px 32px')};
`;

export default StepSection;

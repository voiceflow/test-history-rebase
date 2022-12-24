import { styled, units } from '@/hocs/styled';

interface FormControlContentProps {
  contentBottomUnits?: number;
}

const FormControlContent = styled.div<FormControlContentProps>`
  padding-bottom: ${({ contentBottomUnits = 2 }) => units(contentBottomUnits)}px;
`;

export default FormControlContent;

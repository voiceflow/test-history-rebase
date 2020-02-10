import { styled, units } from '@/hocs';

const FormControlContent = styled.div`
  padding-bottom: ${({ contentBottomUnits = 2 }) => units(contentBottomUnits)}px;
`;

export default FormControlContent;

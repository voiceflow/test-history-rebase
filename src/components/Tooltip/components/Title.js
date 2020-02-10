import { styled, units } from '@/hocs';

const Title = styled.h6`
  margin-bottom: ${({ marginBottomUnits }) => units(marginBottomUnits)}px;
  color: ${({ isSubtitle }) => (isSubtitle ? '#62778c' : '#132144')};
  font-weight: 600;
  font-size: 15px;
  text-transform: capitalize;
`;

export default Title;

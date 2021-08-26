import { styled, units } from '@/hocs';

interface TitleProps {
  isSubtitle?: boolean;
  marginBottomUnits?: number;
}

const Title = styled.h6<TitleProps>`
  margin-bottom: ${({ marginBottomUnits }) => units(marginBottomUnits)}px;
  color: ${({ isSubtitle }) => (isSubtitle ? '#62778c' : '#132144')};
  font-weight: 600;
  font-size: 15px;
  text-transform: capitalize;
`;

export default Title;

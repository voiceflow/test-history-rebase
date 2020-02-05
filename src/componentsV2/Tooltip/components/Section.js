import { styled, units } from '@/hocs';

const Section = styled.section`
  &:not(:last-child) {
    margin-bottom: ${({ marginBottomUnits }) => units(marginBottomUnits)}px;
  }
`;

export default Section;

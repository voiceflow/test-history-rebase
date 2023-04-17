import { styled, units } from '@ui/styles';

export interface SectionProps {
  marginBottomUnits?: number;
}

const Section = styled.section<SectionProps>`
  &:not(:last-child) {
    margin-bottom: ${({ marginBottomUnits }) => units(marginBottomUnits)}px;
  }
`;

export default Section;

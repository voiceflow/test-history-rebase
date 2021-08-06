import { styled, units } from '@/hocs';

export interface SectionProps {
  marginBottomUnits: number;
}

const Section = styled.section<SectionProps>`
  &:not(:last-child) {
    margin-bottom: ${({ marginBottomUnits }) => units(marginBottomUnits)}px;
  }
`;

export default Section;

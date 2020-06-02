import { styled, units } from '@/hocs';

export type SectionProps = {
  marginBottomUnits: number;
};

const Section = styled.section<SectionProps>`
  &:not(:last-child) {
    margin-bottom: ${({ marginBottomUnits }) => units(marginBottomUnits)}px;
  }
`;

export default Section;

import { styled, units } from '@/styles';

export interface ParagraphProps {
  marginBottomUnits?: number;
}

const Paragraph = styled.p<ParagraphProps>`
  font-size: 15px;

  &:not(:last-child) {
    margin-bottom: ${({ marginBottomUnits }) => units(marginBottomUnits)}px;
  }
`;

export default Paragraph;

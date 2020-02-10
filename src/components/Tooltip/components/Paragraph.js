import { styled, units } from '@/hocs';

const Paragraph = styled.p`
  font-size: 15px;
  &:not(:last-child) {
    margin-bottom: ${({ marginBottomUnits }) => units(marginBottomUnits)}px;
  }
`;

export default Paragraph;

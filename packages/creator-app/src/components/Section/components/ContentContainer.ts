import { SectionToggleVariant } from '@/components/Section/constants';
import { styled } from '@/hocs';

interface ContentContainerProps {
  noHeader?: boolean;
  sectionToggleVariant?: SectionToggleVariant | null;
  isCollapsed?: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  padding: ${({ noHeader }) => (noHeader ? '20px 32px' : '0 32px')};

  ${({ sectionToggleVariant, isCollapsed }) =>
    sectionToggleVariant === SectionToggleVariant.ADD &&
    !isCollapsed &&
    `
    padding-bottom: 17px;
  `}
`;

export default ContentContainer;

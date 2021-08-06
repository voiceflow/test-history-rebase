import { styled } from '@/hocs';

interface ContentContainerProps {
  noHeader?: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  padding: ${({ noHeader }) => (noHeader ? '20px 32px' : '0 32px')};
`;

export default ContentContainer;

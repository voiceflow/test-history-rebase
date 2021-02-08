import { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';

type ContentContainerProps = {
  width?: number;
};

const ContentContainer = styled(FlexCenter)<ContentContainerProps>`
  position: absolute;
  top: 0;
  width: ${({ width }) => width}px;
  right: ${({ theme }) => theme.components.prototypeSidebar.width}px;
  bottom: 0;
`;

export default ContentContainer;

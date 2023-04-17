import PlatformUploadPopup from '@/components/PlatformUploadPopup';
import { styled } from '@/hocs/styled';

const Popup = styled(PlatformUploadPopup)`
  top: ${({ theme }) => theme.components.page.header.height + -3}px !important;
  right: 16px !important;
`;

export default Popup;

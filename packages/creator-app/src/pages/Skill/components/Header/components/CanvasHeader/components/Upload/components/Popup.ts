import { styled } from '@/hocs';
// TODO: after the feature release move UploadPopup component to other place
import UploadPopup from '@/pages/Canvas/header/ActionGroup/components/UploadPopup';

const Popup = styled(UploadPopup)`
  top: ${({ theme }) => theme.components.projectPage.header.height + 12}px !important;
  right: 16px !important;
`;

export default Popup;

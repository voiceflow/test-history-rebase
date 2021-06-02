import BaseModal from '@/components/Modal';
import { Header } from '@/components/Modal/components';
import { styled } from '@/hocs';

const Modal = styled(BaseModal)`
  ${Header} {
    height: 52px;
    padding: 0 32px;
    box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
    background-color: #f9f9f9;
  }
`;

export default Modal;

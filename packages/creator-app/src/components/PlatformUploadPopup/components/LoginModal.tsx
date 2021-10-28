import React from 'react';

import { ModalType } from '@/constants';
import BaseModal from '@/pages/Dashboard/components/ConnectBaseModal';

const LoginModal: React.FC = () => <BaseModal modalType={ModalType.CONNECT} />;

export default LoginModal;

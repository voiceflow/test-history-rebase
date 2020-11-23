import React from 'react';

import { ModalType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import BaseModal from '@/pages/Dashboard/components/ConnectBaseModal';
import { ConnectedProps } from '@/types';

const LoginModal: React.FC<ConnectedLoginModalProps> = ({ platform }) => {
  return <BaseModal modalType={ModalType.CONNECT} platform={platform} />;
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

type ConnectedLoginModalProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(LoginModal);

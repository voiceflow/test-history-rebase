import { Box, Button, Input, Link, stopImmediatePropagation, SvgIcon, toast } from '@voiceflow/ui';
import React from 'react';

// // import client from '@/client';
// import InfoIcon from '@/components/InfoIcon';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import UpgradeContainer from '@/components/Upgrade/UpgradeContainer';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { withEnterPress, withTargetValue } from '@/utils/dom';

const ChangeEmailModal: React.FC = () => {
  const [nextEmail, setNextEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const { isOpened, close } = useModals(ModalType.CHANGE_EMAIL_MODAL);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setSaving(false);
    setPassword('');
    setNextEmail('');
  };

  React.useEffect(() => {
    if (isOpened) {
      nameInputRef.current?.focus();
    }
  }, [isOpened]);

  const handleSave = async () => {
    if (!password.trim() || saving) return;
    setSaving(true);
    try {
      toast.success('Validation email successfully sent');
      reset();
      close();
    } catch (e) {
      toast.error('Unable to update email, try again later');
      setSaving(false);
    }
  };

  if (!isOpened) return null;

  return (
    <Modal id={ModalType.CHANGE_EMAIL_MODAL} title="Change Email">
      <ModalBody>
        <div style={{ color: '#62778c', marginBottom: '12px', fontWeight: 600 }}>Email</div>
        <Input
          onKeyPress={withEnterPress(handleSave)}
          ref={nameInputRef}
          value={nextEmail}
          onChange={withTargetValue(setNextEmail)}
          placeholder="New Email"
        />
        <br />
        <div style={{ color: '#62778c', marginBottom: '12px', fontWeight: 600 }}>Password</div>
        <Input
          onKeyPress={withEnterPress(handleSave)}
          value={password}
          onChange={withTargetValue(setPassword)}
          placeholder="Confirm Voiceflow password"
        />
        <br />
        <br />
        <br />
        <Box position="absolute" left={0} right={0} bottom={0}>
          <UpgradeContainer onClick={stopImmediatePropagation()} style={{ padding: '32px' }}>
            <SvgIcon icon="info" color="#3d82e2" mr={16} mb={16} />
            We will send a validation email to your new email address. Click the "Confirm email" button inside to complete the change. &nbsp;
          </UpgradeContainer>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Link onClick={() => close()} style={{ marginRight: '33px', fontWeight: 600 }}>
          Cancel
        </Link>
        <Button disabled={!nextEmail || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Submit'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChangeEmailModal;
